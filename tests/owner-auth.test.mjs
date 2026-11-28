import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('owner password login creates a verified Supabase session without an email link', async () => {
  const source = await readFile(new URL('../owner-auth.js', import.meta.url), 'utf8');
  const elements = new Map();
  const created = [];

  function makeElement(tagName) {
    const element = {
      tagName,
      style: {},
      children: [],
      listeners: {},
      attributes: {},
      value: '',
      disabled: false,
      textContent: '',
      appendChild(child) {
        this.children.push(child);
        if (child.id) elements.set(child.id, child);
        return child;
      },
      addEventListener(name, listener) { this.listeners[name] = listener; },
      setAttribute(name, value) { this.attributes[name] = value; },
      focus() {},
      contains(target) { return this === target || this.children.some((child) => child.contains(target)); },
    };
    created.push(element);
    return element;
  }

  const body = makeElement('body');
  const document = {
    body,
    createElement: makeElement,
    getElementById(id) { return elements.get(id) || null; },
  };

  let session = null;
  let changeListener = null;
  let loginArgs = null;
  let clientOptions = null;
  const user = {
    email: 'hafezzaza98@gmail.com',
    email_confirmed_at: '2026-01-01T00:00:00Z',
    is_anonymous: false,
  };
  const auth = {
    onAuthStateChange(listener) { changeListener = listener; },
    async getSession() { return { data: { session }, error: null }; },
    async getUser(token) {
      assert.equal(token, 'owner-access-token');
      return { data: { user }, error: null };
    },
    async signInWithPassword(args) {
      loginArgs = args;
      session = { access_token: 'owner-access-token', user };
      if (changeListener) changeListener('SIGNED_IN', session);
      return { data: { session, user }, error: null };
    },
    async signOut() { session = null; return { error: null }; },
  };
  const window = {
    SUPABASE_CHAT_CONFIG: { url: 'https://supabase.test', publishableKey: 'public-test-key' },
    supabase: { createClient(_url, _key, options) { clientOptions = options; return { auth }; } },
    dispatchEvent() {},
    setTimeout(callback) { callback(); },
  };

  vm.runInNewContext(source, { window, document, console, CustomEvent: class CustomEvent {} });
  const status = makeElement('p');
  status.id = 'ownerStatus';
  body.appendChild(status);

  const login = window.HafezOwnerAuth.requestPasswordLogin('ownerStatus');
  await new Promise((resolve) => setImmediate(resolve));
  const passwordInput = created.find((element) => element.tagName === 'input');
  const submit = created.find((element) => element.tagName === 'button' && element.textContent === 'دخول');
  assert.ok(passwordInput, 'password input should be shown');
  assert.ok(submit, 'login button should be shown');
  passwordInput.value = 'test-password';
  await submit.listeners.click();

  assert.equal(await login, true);
  assert.deepEqual(JSON.parse(JSON.stringify(loginArgs)), {
    email: 'hafezzaza98@gmail.com',
    password: 'test-password',
  });
  assert.equal(clientOptions.auth.persistSession, true);
  assert.equal(clientOptions.auth.detectSessionInUrl, false);
  assert.equal(passwordInput.value, '');
  assert.match(status.textContent, /تم تسجيل الدخول للإدارة بنجاح/);
});
