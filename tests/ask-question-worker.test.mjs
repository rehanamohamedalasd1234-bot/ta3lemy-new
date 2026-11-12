import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/ta3lemy-ask/src/index.mjs';

const origin = 'https://rehanamohamedalasd1234-bot.github.io';
const envWithAI = (overrides = {}) => ({
  AI: {
    async run(model, input) {
      assert.equal(model, '@cf/google/gemma-4-26b-a4b-it');
      assert.ok(input.messages.some((message) => message.role === 'user'));
      return { response: 'الإجابة التجريبية: ابدأ بتحديد المعطيات ثم حل المسألة خطوة خطوة.' };
    }
  },
  ASK_RATE_LIMIT: { async limit() { return { success: true }; } },
  ...overrides
});

function request(path, method = 'GET', body, requestOrigin = origin) {
  const headers = {};
  if (requestOrigin) headers.Origin = requestOrigin;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  return new Request(`https://ta3lemy-ask.test${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

test('health reports whether the AI binding exists', async () => {
  const response = await worker.fetch(request('/health'), envWithAI());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ready, true);
});

test('preflight is an empty 204 with allowed CORS headers', async () => {
  const response = await worker.fetch(request('/ask', 'OPTIONS'), envWithAI());
  assert.equal(response.status, 204);
  assert.equal(await response.text(), '');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
});

test('valid question returns an Arabic answer without storing history', async () => {
  const response = await worker.fetch(request('/ask', 'POST', {
    question: 'كيف أجمع الكسور؟', stage: 'تعليم عام', grade: 'الخامس الابتدائي', subject: 'الرياضيات', style: 'steps'
  }), envWithAI());
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.match(data.answer, /الإجابة التجريبية/);
  assert.equal(data.model, 'مساعد دراسي عربي');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('extracts model output from a chat-completions choices response', async () => {
  const env = envWithAI({
    AI: { async run() { return { choices: [{ message: { role: 'assistant', content: 'الناتج هو ٤.' } }] }; } }
  });
  const response = await worker.fetch(request('/ask', 'POST', {
    question: 'كم يساوي ٢ + ٢؟', stage: 'تعليم عام', grade: 'الأول الابتدائي', subject: 'الرياضيات', style: 'steps'
  }), env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).answer, 'الناتج هو ٤.');
});

test('rejects requests from unknown origins', async () => {
  const response = await worker.fetch(request('/ask', 'POST', { question: 'سؤال تجريبي' }, 'https://example.com'), envWithAI());
  assert.equal(response.status, 403);
});

test('rejects empty questions before calling the model', async () => {
  let called = false;
  const env = envWithAI({ AI: { async run() { called = true; return { response: 'x' }; } } });
  const response = await worker.fetch(request('/ask', 'POST', { question: '  ' }), env);
  assert.equal(response.status, 400);
  assert.equal(called, false);
});

test('rejects email and Egyptian mobile numbers before calling the model', async () => {
  let called = false;
  const env = envWithAI({ AI: { async run() { called = true; return { response: 'x' }; } } });
  const emailResponse = await worker.fetch(request('/ask', 'POST', { question: 'راسلني student@example.com بشأن السؤال' }), env);
  const phoneResponse = await worker.fetch(request('/ask', 'POST', { question: 'رقمي 01012345678 وهذا السؤال' }), env);
  assert.equal(emailResponse.status, 400);
  assert.equal(phoneResponse.status, 400);
  assert.equal(called, false);
});

test('limits streamed request bytes even without a Content-Length header', async () => {
  let called = false;
  const env = envWithAI({ AI: { async run() { called = true; return { response: 'x' }; } } });
  const response = await worker.fetch(request('/ask', 'POST', { question: 'س'.repeat(8000) }), env);
  assert.equal(response.status, 413);
  assert.equal(called, false);
});

test('fails closed when the rate-limit binding is missing', async () => {
  let called = false;
  const env = envWithAI({ ASK_RATE_LIMIT: undefined, AI: { async run() { called = true; return { response: 'x' }; } } });
  const response = await worker.fetch(request('/ask', 'POST', { question: 'ما تعريف الخلية؟' }), env);
  assert.equal(response.status, 503);
  assert.equal(called, false);
});

test('rate limit blocks the model call', async () => {
  let called = false;
  const env = envWithAI({
    AI: { async run() { called = true; return { response: 'x' }; } },
    ASK_RATE_LIMIT: { async limit() { return { success: false }; } }
  });
  const response = await worker.fetch(request('/ask', 'POST', { question: 'ما تعريف الخلية؟' }), env);
  assert.equal(response.status, 429);
  assert.equal(called, false);
});

test('unknown route returns 404', async () => {
  const response = await worker.fetch(request('/missing'), envWithAI());
  assert.equal(response.status, 404);
});
