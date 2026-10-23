const encoder = new TextEncoder();
const LEGACY_PREFIX = 'hafez_secure';
const PBKDF2_ITERATIONS = 210000;
const CHALLENGE_TTL_MS = 2 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 8;
const REGISTRATION_WINDOW_MS = 24 * 60 * 60 * 1000;
const REGISTRATION_LIMIT = 100;
const RECOVERY_WINDOW_MS = 24 * 60 * 60 * 1000;
const RECOVERY_LIMIT = 8;
let cachedGoogleToken = null;
let cachedSigningKey = null;
let cachedSigningKeyIdentity = '';

class ApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status || statusForCode(code);
  }
}

function statusForCode(code) {
  if (code === 'invalid-argument') return 400;
  if (code === 'permission-denied') return 403;
  if (code === 'resource-exhausted') return 429;
  if (code === 'failed-precondition' || code === 'already-exists' || code === 'aborted') return 409;
  return 500;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function textToBase64Url(value) {
  return bytesToBase64Url(encoder.encode(value));
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function randomId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID().replace(/-/g, '');
  return bytesToHex(randomBytes(16));
}

function randomRecoveryCode() {
  const span = 900000;
  const max = Math.floor(0x100000000 / span) * span;
  let value;
  do { value = crypto.getRandomValues(new Uint32Array(1))[0]; } while (value >= max);
  return String(100000 + (value % span));
}

function constantTimeEqual(left, right) {
  const a = encoder.encode(String(left || ''));
  const b = encoder.encode(String(right || ''));
  let mismatch = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i += 1) mismatch |= (a[i] || 0) ^ (b[i] || 0);
  return mismatch === 0;
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(String(value)));
  return bytesToHex(new Uint8Array(digest));
}

async function legacyHash(password, salt) {
  return sha256Hex(String(salt || '') + '|' + String(password) + '|' + LEGACY_PREFIX);
}

function legacyFallbackHash(password, salt) {
  const value = String(salt || '') + '|' + String(password) + '|' + LEGACY_PREFIX;
  let h1 = 5381;
  let h2 = 52711;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    h1 = ((h1 * 33) ^ code) >>> 0;
    h2 = ((h2 * 31) ^ code) >>> 0;
  }
  return 'f_' + h1.toString(16) + h2.toString(16);
}

async function challengeProof(verifier, message) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(String(verifier)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(String(message)));
  return bytesToBase64Url(new Uint8Array(signature));
}

function validateIdentity(data) {
  const username = String(data && data.username || '').trim();
  const deviceId = String(data && data.deviceId || '').trim();
  if (username.length < 3 || username.length > 64) {
    throw new ApiError('invalid-argument', 'تحقق من اسم المستخدم.');
  }
  if (!deviceId || deviceId.length > 200) {
    throw new ApiError('invalid-argument', 'تعذر التحقق من هذا الجهاز.');
  }
  return { username, deviceId };
}

function parseServiceAccount(env) {
  if (!env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new ApiError('failed-precondition', 'خدمة تسجيل الدخول غير مهيأة بعد.');
  }
  let serviceAccount;
  try { serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON); }
  catch (_) { throw new ApiError('failed-precondition', 'إعداد مفتاح Firebase غير صالح.'); }
  const expectedProject = String(env.FIREBASE_PROJECT_ID || 'ta3lemt-hafez');
  if (!serviceAccount.project_id || serviceAccount.project_id !== expectedProject || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new ApiError('failed-precondition', 'مفتاح الخدمة لا يطابق مشروع Firebase المطلوب.');
  }
  return serviceAccount;
}

function pemToBytes(pem) {
  const base64 = String(pem).replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\s+/g, '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function signJwt(serviceAccount, claims) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const signingInput = textToBase64Url(JSON.stringify(header)) + '.' + textToBase64Url(JSON.stringify(claims));
  const identity = String(serviceAccount.client_email || '') + '|' + String(serviceAccount.private_key_id || '');
  if (!cachedSigningKey || cachedSigningKeyIdentity !== identity) {
    cachedSigningKey = await crypto.subtle.importKey(
      'pkcs8',
      pemToBytes(serviceAccount.private_key),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
    cachedSigningKeyIdentity = identity;
  }
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cachedSigningKey, encoder.encode(signingInput));
  return signingInput + '.' + bytesToBase64Url(new Uint8Array(signature));
}

async function googleAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedGoogleToken && cachedGoogleToken.email === serviceAccount.client_email && cachedGoogleToken.expiresAt > now + 60) {
    return cachedGoogleToken.token;
  }
  const assertion = await signJwt(serviceAccount, {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/identitytoolkit',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.access_token) {
    console.error('Google OAuth token exchange failed', response.status);
    throw new ApiError('internal', 'تعذر الاتصال بخدمات Firebase.');
  }
  cachedGoogleToken = { email: serviceAccount.client_email, token: result.access_token, expiresAt: now + Number(result.expires_in || 3600) };
  return result.access_token;
}

function firestoreBase(projectId) {
  return 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(projectId) + '/databases/(default)/documents';
}

function firestoreResource(projectId, documentPath) {
  return 'projects/' + projectId + '/databases/(default)/documents/' + documentPath;
}

function firestoreUrl(base, documentPath) {
  const encodedPath = String(documentPath).split('/').map(encodeURIComponent).join('/');
  return base + '/' + encodedPath;
}

function decodeFirestoreValue(value) {
  if (!value || typeof value !== 'object') return null;
  if (Object.prototype.hasOwnProperty.call(value, 'nullValue')) return null;
  if (Object.prototype.hasOwnProperty.call(value, 'stringValue')) return value.stringValue;
  if (Object.prototype.hasOwnProperty.call(value, 'integerValue')) return Number(value.integerValue);
  if (Object.prototype.hasOwnProperty.call(value, 'doubleValue')) return Number(value.doubleValue);
  if (Object.prototype.hasOwnProperty.call(value, 'booleanValue')) return Boolean(value.booleanValue);
  if (Object.prototype.hasOwnProperty.call(value, 'timestampValue')) return value.timestampValue;
  if (Object.prototype.hasOwnProperty.call(value, 'arrayValue')) return (value.arrayValue.values || []).map(decodeFirestoreValue);
  if (Object.prototype.hasOwnProperty.call(value, 'mapValue')) return decodeFirestoreFields(value.mapValue.fields || {});
  return null;
}

function decodeFirestoreFields(fields) {
  const result = {};
  for (const [key, value] of Object.entries(fields || {})) result[key] = decodeFirestoreValue(value);
  return result;
}

function encodeFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeFirestoreValue) } };
  if (typeof value === 'object') return { mapValue: { fields: encodeFirestoreFields(value) } };
  return { stringValue: String(value) };
}

function encodeFirestoreFields(fields) {
  const result = {};
  for (const [key, value] of Object.entries(fields || {})) result[key] = encodeFirestoreValue(value);
  return result;
}

function decodeDocument(document) {
  if (!document) return null;
  const name = String(document.name || '');
  const id = name.split('/').pop() || '';
  return { id, data: decodeFirestoreFields(document.fields || {}), raw: document };
}

async function googleJson(url, accessToken, options, allowNotFound) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: 'Bearer ' + accessToken,
      ...(options && options.headers || {})
    }
  });
  if (allowNotFound && response.status === 404) return null;
  if (response.status === 204) return null;
  if (!response.ok) {
    let googleStatus = '';
    try { const body = await response.json(); googleStatus = body && body.error && body.error.status || ''; } catch (_) {}
    const error = new ApiError('internal', 'تعذر تنفيذ عملية آمنة على Firebase.');
    error.googleStatus = googleStatus;
    error.httpStatus = response.status;
    console.error('Firebase REST request failed', response.status, googleStatus);
    throw error;
  }
  return response.json();
}

function parseJsonSequence(text) {
  const cleaned = String(text || '').trim().replace(/^\)\]\}'\s*/, '');
  if (!cleaned) return [];
  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (_) {
    return cleaned.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  }
}

class FirestoreRest {
  constructor(projectId, accessToken) {
    this.projectId = projectId;
    this.accessToken = accessToken;
    this.base = firestoreBase(projectId);
  }
  async get(documentPath, transaction) {
    const suffix = transaction ? '?transaction=' + encodeURIComponent(transaction) : '';
    const document = await googleJson(firestoreUrl(this.base, documentPath) + suffix, this.accessToken, { method: 'GET' }, true);
    return decodeDocument(document);
  }
  async queryByName(username) {
    const response = await fetch(this.base + ':runQuery', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + this.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'users' }],
          where: { fieldFilter: { field: { fieldPath: 'name' }, op: 'EQUAL', value: { stringValue: username } } },
          limit: 2
        }
      })
    });
    if (!response.ok) {
      let status = '';
      try { const body = await response.json(); status = body && body.error && body.error.status || ''; } catch (_) {}
      console.error('Firestore runQuery failed', response.status, status);
      throw new ApiError('internal', 'تعذر البحث الآمن عن الحساب.');
    }
    const result = parseJsonSequence(await response.text());
    return result.filter((item) => item && item.document).map((item) => decodeDocument(item.document));
  }
  async beginTransaction() {
    const result = await googleJson(this.base + ':beginTransaction', this.accessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options: { readWrite: {} } })
    });
    if (!result || !result.transaction) throw new ApiError('internal', 'تعذر بدء معاملة Firebase.');
    return result.transaction;
  }
  async commit(writes, transaction) {
    return googleJson(this.base + ':commit', this.accessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes: writes || [], ...(transaction ? { transaction } : {}) })
    });
  }
  async rollback(transaction) {
    return googleJson(this.base + ':rollback', this.accessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction })
    }).catch(() => null);
  }
  async update(documentPath, data, exists) {
    return this.commit([updateWrite(this.projectId, documentPath, data, exists)]);
  }
  async delete(documentPath) {
    const response = await fetch(firestoreUrl(this.base, documentPath), {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + this.accessToken }
    });
    if (response.status === 404 || response.status === 204 || response.ok) return;
    console.error('Firebase REST delete failed', response.status);
  }
  async log(record) {
    const url = this.base + '/login_logs?documentId=' + encodeURIComponent(randomId());
    await googleJson(url, this.accessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: encodeFirestoreFields({ ...record, ttlExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }) })
    }).catch(() => null);
  }
}

function updateWrite(projectId, documentPath, data, exists) {
  const write = {
    update: { name: firestoreResource(projectId, documentPath), fields: encodeFirestoreFields(data) },
    updateMask: { fieldPaths: Object.keys(data) }
  };
  if (exists !== undefined) write.currentDocument = { exists: Boolean(exists) };
  return write;
}

function deleteWrite(projectId, documentPath) {
  return { delete: firestoreResource(projectId, documentPath) };
}

async function reserveLoginAttempt(db, username, ip) {
  const path = 'auth_rate_limits/' + await sha256Hex(username + '|' + ip);
  const now = Date.now();
  const transaction = await db.beginTransaction();
  try {
    const oldDoc = await db.get(path, transaction);
    const old = oldDoc ? oldDoc.data : {};
    const stillInWindow = now - Number(old.windowStart || 0) < RATE_WINDOW_MS;
    const attempts = stillInWindow ? Number(old.attempts || 0) : 0;
    if (attempts >= RATE_LIMIT) {
      await db.rollback(transaction);
      throw new ApiError('resource-exhausted', 'محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.');
    }
    const value = {
      windowStart: stillInWindow ? Number(old.windowStart) : now,
      attempts: attempts + 1,
      updatedAt: new Date(now).toISOString(),
      ttlExpiresAt: new Date(now + 24 * 60 * 60 * 1000)
    };
    await db.commit([updateWrite(db.projectId, path, value, oldDoc ? undefined : false)], transaction);
    return { path };
  } catch (error) {
    await db.rollback(transaction);
    throw error;
  }
}

async function clearRateLimit(db, limiter) {
  await db.delete(limiter.path);
}

async function reserveRegistrationSlot(db, ip) {
  const path = 'auth_registration_limits/' + await sha256Hex(ip);
  const now = Date.now();
  const transaction = await db.beginTransaction();
  try {
    const snap = await db.get(path, transaction);
    const old = snap ? snap.data : {};
    const active = now - Number(old.windowStart || 0) < REGISTRATION_WINDOW_MS;
    const count = active ? Number(old.accountsCreated || 0) : 0;
    if (count >= REGISTRATION_LIMIT) {
      await db.rollback(transaction);
      throw new ApiError('resource-exhausted', 'وصل هذا الاتصال إلى حد إنشاء الحسابات اليومي؛ تواصل مع المالك لإكمال التسجيل.');
    }
    const value = {
      windowStart: active ? Number(old.windowStart) : now,
      accountsCreated: count + 1,
      updatedAt: new Date(now).toISOString(),
      ttlExpiresAt: new Date(now + 48 * 60 * 60 * 1000)
    };
    await db.commit([updateWrite(db.projectId, path, value, snap ? undefined : false)], transaction);
  } catch (error) {
    await db.rollback(transaction);
    throw error;
  }
}

async function lookupExistingUser(db, username) {
  const matches = await db.queryByName(username);
  if (matches.length > 1) throw new ApiError('failed-precondition', 'يوجد أكثر من حساب بهذا الاسم؛ يحتاج الحساب مراجعة المالك قبل التفعيل الآمن.');
  return matches.length ? matches[0] : null;
}

async function createLoginChallenge(db, username, deviceId, ip) {
  const limiter = await reserveLoginAttempt(db, username, ip);
  const existing = await lookupExistingUser(db, username);
  const now = Date.now();
  const challengeId = randomId();
  const nonce = bytesToBase64Url(randomBytes(32));
  const legacySalt = existing && existing.data.salt ? String(existing.data.salt) : bytesToBase64Url(randomBytes(18));
  const passwordSaltV2 = existing && existing.data.passwordSaltV2 && existing.data.passwordHashV2
    ? String(existing.data.passwordSaltV2)
    : bytesToBase64Url(randomBytes(18));
  const challengeData = {
    username,
    deviceId,
    nonce,
    createdAt: now,
    expiresAt: now + CHALLENGE_TTL_MS,
    ttlExpiresAt: new Date(now + CHALLENGE_TTL_MS),
    limiterPath: limiter.path,
    legacySalt,
    passwordSaltV2
  };
  let responseData;

  if (existing) {
    const user = existing.data || {};
    if (user.role && user.role !== 'student') throw new ApiError('permission-denied', 'هذا الحساب يستخدم مسار دخول آخر؛ اختر طريقة الدخول المناسبة.');
    if (user.passwordHashV2 && user.passwordSaltV2) {
      challengeData.mode = 'pbkdf2';
      challengeData.uid = existing.id;
      challengeData.verifierFingerprint = await sha256Hex('pbkdf2|' + user.passwordSaltV2 + '|' + user.passwordHashV2);
    } else if (user.salt && user.passHash) {
      challengeData.mode = String(user.passHash).startsWith('f_') ? 'legacy-fallback' : 'legacy-sha256';
      challengeData.uid = existing.id;
      challengeData.passwordSaltV2 = bytesToBase64Url(randomBytes(18));
      challengeData.verifierFingerprint = await sha256Hex(challengeData.mode + '|' + user.salt + '|' + user.passHash);
    } else {
      throw new ApiError('failed-precondition', 'تعذر التحقق من كلمة مرور هذا الحساب؛ تواصل مع المالك.');
    }
  } else {
    challengeData.mode = 'new';
  }
  responseData = {
    challengeId,
    nonce,
    legacySalt: challengeData.legacySalt,
    passwordSaltV2: challengeData.passwordSaltV2,
    iterations: PBKDF2_ITERATIONS
  };
  await db.update('auth_challenges/' + challengeId, challengeData, false);
  return responseData;
}

function validateChallengeInput(data) {
  const challengeId = String(data && data.challengeId || '').trim();
  const deviceId = String(data && data.deviceId || '').trim();
  const proofPbkdf2 = String(data && data.proofPbkdf2 || '');
  const proofLegacySha256 = String(data && data.proofLegacySha256 || '');
  const proofLegacyFallback = String(data && data.proofLegacyFallback || '');
  const proof = String(data && data.proof || '');
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(challengeId) || !deviceId || deviceId.length > 200) {
    throw new ApiError('invalid-argument', 'طلب تسجيل الدخول غير صالح.');
  }
  if (proof.length > 128 || proofPbkdf2.length > 128 || proofLegacySha256.length > 128 || proofLegacyFallback.length > 128) {
    throw new ApiError('invalid-argument', 'إثبات تسجيل الدخول غير صالح.');
  }
  return {
    challengeId,
    deviceId,
    proof,
    proofPbkdf2,
    proofLegacySha256,
    proofLegacyFallback,
    recoveryCode: String(data && data.recoveryCode || '').trim(),
    passwordHashV2: String(data && data.passwordHashV2 || '').toLowerCase(),
    legacyPassHash: String(data && data.legacyPassHash || '').toLowerCase(),
    upgradePasswordHashV2: String(data && data.upgradePasswordHashV2 || '').toLowerCase()
  };
}

function challengeMessage(challengeId, challenge) {
  return 'ta3lemy-login-v1|' + challengeId + '|' + challenge.nonce + '|' + challenge.deviceId + '|' + challenge.username;
}

async function lookupFirebaseAuthUser(projectId, uid, accessToken) {
  const url = 'https://identitytoolkit.googleapis.com/admin/v2/projects/' + encodeURIComponent(projectId) + '/accounts:lookup';
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ localIds: [String(uid)] })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 404) return null;
    console.error('Firebase Auth account lookup failed', response.status);
    throw new ApiError('internal', 'تعذر التحقق من معرّف Firebase.');
  }
  return (result.users || []).find((user) => String(user.localId || '') === String(uid)) || null;
}

async function ensureCompatibleAuthUid(projectId, uid, accessToken) {
  const existing = await lookupFirebaseAuthUser(projectId, uid, accessToken);
  if (!existing) return;
  if (existing.phoneNumber || (Array.isArray(existing.providerUserInfo) && existing.providerUserInfo.length)) {
    throw new ApiError('failed-precondition', 'معرّف الحساب مستخدم في مصادقة أخرى؛ أوقفنا الربط لحماية الحساب.');
  }
  let currentClaims = {};
  try { currentClaims = JSON.parse(existing.customAttributes || '{}'); } catch (_) {}
  if (currentClaims.role && currentClaims.role !== 'student') {
    throw new ApiError('failed-precondition', 'معرّف الحساب يحمل دورًا مختلفًا؛ أوقفنا الربط لحماية الصلاحيات.');
  }
}

async function createStudentCustomToken(serviceAccount, uid) {
  const now = Math.floor(Date.now() / 1000);
  return signJwt(serviceAccount, {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: now,
    exp: now + 3600,
    uid: String(uid),
    claims: { role: 'student' }
  });
}

function userResourceName(projectId, uid) {
  return firestoreResource(projectId, 'users/' + uid);
}

async function completeLogin(db, projectId, accessToken, serviceAccount, input, ip) {
  const challengePath = 'auth_challenges/' + input.challengeId;
  const transaction = await db.beginTransaction();
  let settled = false;
  const consumeChallenge = async () => {
    await db.commit([deleteWrite(projectId, challengePath)], transaction);
    settled = true;
  };
  try {
    const challengeDoc = await db.get(challengePath, transaction);
    if (!challengeDoc) throw new ApiError('failed-precondition', 'انتهت صلاحية الطلب؛ أعد المحاولة.');
    const challenge = challengeDoc.data;
    const now = Date.now();
    if (Number(challenge.expiresAt || 0) < now || challenge.deviceId !== input.deviceId) {
      await consumeChallenge();
      throw new ApiError('failed-precondition', 'انتهت صلاحية الطلب؛ أعد المحاولة.');
    }

    if (challenge.mode === 'new') {
      if (!input.passwordHashV2 || !input.legacyPassHash) {
        await db.rollback(transaction);
        settled = true;
        return { needsRegistrationVerifier: true };
      }
      if (!/^[a-f0-9]{64}$/.test(input.passwordHashV2) || !/^[a-f0-9]{64}$/.test(input.legacyPassHash)) {
        await consumeChallenge();
        throw new ApiError('invalid-argument', 'تعذر تجهيز كلمة المرور بأمان. أعد المحاولة.');
      }
      const expected = await challengeProof(input.passwordHashV2, challengeMessage(input.challengeId, challenge));
      if (!constantTimeEqual(expected, input.proofPbkdf2)) {
        await consumeChallenge();
        throw new ApiError('permission-denied', 'تعذر التحقق من بيانات الدخول. أعد المحاولة.');
      }
      const duplicate = await lookupExistingUser(db, challenge.username);
      if (duplicate) {
        await consumeChallenge();
        throw new ApiError('failed-precondition', 'هذا الاسم أصبح مرتبطًا بحساب؛ ابدأ تسجيل الدخول من جديد.');
      }
      await reserveRegistrationSlot(db, ip);
      const registryPath = 'username_registry/' + await sha256Hex(challenge.username);
      const registry = await db.get(registryPath, transaction);
      if (registry) {
        await consumeChallenge();
        throw new ApiError('failed-precondition', 'هذا الاسم أصبح مرتبطًا بحساب؛ ابدأ تسجيل الدخول من جديد.');
      }
      const uid = 'u_' + Date.now().toString(36) + '_' + bytesToHex(randomBytes(9));
      await ensureCompatibleAuthUid(projectId, uid, accessToken);
      const createdAt = new Date().toISOString();
      const userData = {
        name: challenge.username,
        role: 'student',
        salt: challenge.legacySalt,
        passHash: input.legacyPassHash,
        passwordSaltV2: challenge.passwordSaltV2,
        passwordHashV2: input.passwordHashV2,
        authProvider: 'firebase-custom-token',
        authMigrationVersion: 1,
        authUid: uid,
        recoveryCode: randomRecoveryCode(),
        trustedDevices: [input.deviceId],
        points: 0,
        createdAt,
        lastLogin: createdAt
      };
      const writes = [
        updateWrite(projectId, 'users/' + uid, userData, false),
        updateWrite(projectId, registryPath, { uid, createdAt }, false),
        deleteWrite(projectId, challengePath)
      ];
      await db.commit(writes, transaction);
      settled = true;
      await clearRateLimit(db, { path: challenge.limiterPath });
      const customToken = await createStudentCustomToken(serviceAccount, uid);
      await db.log({ username: challenge.username, role: 'student', success: true, reason: 'custom auth registration', timestamp: new Date().toISOString() });
      return { customToken, uid, name: challenge.username, points: 0, role: 'student', isNew: true, recoveryCode: userData.recoveryCode };
    }

    const uid = String(challenge.uid || '');
    const userDoc = uid ? await db.get('users/' + uid, transaction) : null;
    if (!userDoc) {
      await consumeChallenge();
      throw new ApiError('failed-precondition', 'تعذر استعادة سجل الحساب؛ تواصل مع المالك.');
    }
    const user = userDoc.data || {};
    if (user.role && user.role !== 'student') {
      await consumeChallenge();
      throw new ApiError('permission-denied', 'هذا الحساب يستخدم مسار دخول آخر؛ اختر طريقة الدخول المناسبة.');
    }
    const currentFingerprint = challenge.mode === 'pbkdf2'
      ? await sha256Hex('pbkdf2|' + user.passwordSaltV2 + '|' + user.passwordHashV2)
      : await sha256Hex(challenge.mode + '|' + user.salt + '|' + user.passHash);
    if (!constantTimeEqual(currentFingerprint, challenge.verifierFingerprint)) {
      await consumeChallenge();
      throw new ApiError('failed-precondition', 'تغير إعداد الحساب؛ أعد محاولة تسجيل الدخول.');
    }

    const message = challengeMessage(input.challengeId, challenge);
    let verifiedProof = false;
    let proofValue = '';
    if (challenge.proofVerified) {
      proofValue = challenge.mode === 'pbkdf2' ? input.proofPbkdf2
        : challenge.mode === 'legacy-fallback' ? input.proofLegacyFallback
        : input.proofLegacySha256;
      verifiedProof = constantTimeEqual(await sha256Hex(proofValue), String(challenge.proofFingerprint || ''));
    } else if (challenge.mode === 'pbkdf2') {
      proofValue = input.proofPbkdf2;
      const expected = await challengeProof(String(user.passwordHashV2), message);
      verifiedProof = constantTimeEqual(expected, proofValue);
    } else if (challenge.mode === 'legacy-fallback') {
      proofValue = input.proofLegacyFallback;
      const expected = await challengeProof(String(user.passHash), message);
      verifiedProof = constantTimeEqual(expected, proofValue);
    } else if (challenge.mode === 'legacy-sha256') {
      proofValue = input.proofLegacySha256;
      const expected = await challengeProof(String(user.passHash), message);
      verifiedProof = constantTimeEqual(expected, proofValue);
    }
    if (!verifiedProof) {
      await consumeChallenge();
      throw new ApiError('permission-denied', 'اسم المستخدم أو كلمة المرور غير صحيحة.');
    }

    const devices = Array.isArray(user.trustedDevices) ? user.trustedDevices.map(String) : [];
    const newDevice = devices.indexOf(input.deviceId) < 0;
    const needsRecovery = newDevice && !input.recoveryCode;
    const needsUpgradeVerifier = challenge.mode !== 'pbkdf2' && !/^[a-f0-9]{64}$/.test(input.upgradePasswordHashV2);
    if (needsRecovery || needsUpgradeVerifier) {
      if (!challenge.proofVerified) {
        await db.commit([updateWrite(projectId, challengePath, {
          proofVerified: true,
          proofFingerprint: await sha256Hex(proofValue)
        })], transaction);
        settled = true;
      } else {
        await db.rollback(transaction);
        settled = true;
      }
      return { needsRecovery, needsUpgradeVerifier };
    }
    if (newDevice && !constantTimeEqual(input.recoveryCode, user.recoveryCode || '')) {
      const recoveryNow = Date.now();
      const oldWindowStart = Number(user.recoveryWindowStart || 0);
      const inRecoveryWindow = oldWindowStart > 0 && recoveryNow - oldWindowStart < RECOVERY_WINDOW_MS;
      const recoveryAttempts = inRecoveryWindow ? Number(user.recoveryAttempts || 0) : 0;
      if (recoveryAttempts >= RECOVERY_LIMIT) {
        await consumeChallenge();
        throw new ApiError('resource-exhausted', 'تم إيقاف محاولات كود الاستعادة مؤقتًا؛ حاول بعد 24 ساعة.');
      }
      await db.commit([
        updateWrite(projectId, 'users/' + uid, {
          recoveryWindowStart: inRecoveryWindow ? oldWindowStart : recoveryNow,
          recoveryAttempts: recoveryAttempts + 1
        }),
        deleteWrite(projectId, challengePath)
      ], transaction);
      settled = true;
      throw new ApiError('permission-denied', 'اسم المستخدم أو كلمة المرور أو كود الاستعادة غير صحيح.');
    }

    await ensureCompatibleAuthUid(projectId, uid, accessToken);
    const registryPath = 'username_registry/' + await sha256Hex(challenge.username);
    const registry = await db.get(registryPath, transaction);
    if (registry && String(registry.data.uid || '') !== uid) {
      await consumeChallenge();
      throw new ApiError('failed-precondition', 'اسم المستخدم مرتبط بسجل آخر؛ يحتاج مراجعة المالك.');
    }
    const patch = {
      authUid: uid,
      authProvider: 'firebase-custom-token',
      authMigrationVersion: 1,
      lastLogin: new Date().toISOString()
    };
    if (newDevice) {
      patch.trustedDevices = [...devices, input.deviceId];
      patch.recoveryWindowStart = Date.now();
      patch.recoveryAttempts = 0;
    }
    if (challenge.mode !== 'pbkdf2') {
      if (!/^[a-f0-9]{64}$/.test(input.upgradePasswordHashV2) || !challenge.passwordSaltV2) {
        await consumeChallenge();
        throw new ApiError('invalid-argument', 'تعذر تحديث حماية كلمة المرور. أعد المحاولة.');
      }
      patch.passwordSaltV2 = challenge.passwordSaltV2;
      patch.passwordHashV2 = input.upgradePasswordHashV2;
    }
    const writes = [updateWrite(projectId, 'users/' + uid, patch), deleteWrite(projectId, challengePath)];
    if (!registry) writes.push(updateWrite(projectId, registryPath, { uid, createdAt: new Date().toISOString() }, false));
    await db.commit(writes, transaction);
    settled = true;
    await clearRateLimit(db, { path: challenge.limiterPath });
    const customToken = await createStudentCustomToken(serviceAccount, uid);
    await db.log({ username: challenge.username, role: 'student', success: true, reason: 'custom auth', timestamp: new Date().toISOString() });
    return {
      customToken,
      uid,
      name: String(user.name || challenge.username),
      points: Number.isFinite(Number(user.points)) ? Number(user.points) : 0,
      role: 'student',
      isNew: false,
      recoveryCode: null
    };
  } catch (error) {
    if (!settled) await db.rollback(transaction);
    throw error;
  }
}

function decodeErrorResponse(error) {
  if (error instanceof ApiError) return { status: error.status, body: { code: error.code, message: error.message } };
  console.error('Student auth Worker failed', error && error.message || 'unknown');
  return { status: 500, body: { code: 'internal', message: 'تعذر إكمال تسجيل الدخول الآمن. حاول مرة أخرى لاحقًا.' } };
}

function response(request, env, body, status) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Vary': 'Origin'
  };
  if (origin && origin === env.APP_ORIGIN) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '600';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

async function readJson(request) {
  const maxBytes = 16384;
  const headerLength = request.headers.get('Content-Length');
  if (headerLength && /^\d+$/.test(headerLength) && Number(headerLength) > maxBytes) {
    throw new ApiError('invalid-argument', 'حجم الطلب أكبر من المسموح.', 413);
  }
  if (!request.body || typeof request.body.getReader !== 'function') {
    throw new ApiError('invalid-argument', 'صيغة الطلب غير صحيحة.');
  }
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new ApiError('invalid-argument', 'حجم الطلب أكبر من المسموح.', 413);
      }
      chunks.push(part.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('invalid-argument', 'صيغة الطلب غير صحيحة.');
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (origin && origin !== env.APP_ORIGIN) return response(request, env, { code: 'permission-denied', message: 'هذا الموقع غير مصرح له باستخدام الخدمة.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: {
      ...(origin === env.APP_ORIGIN ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '600',
      'Vary': 'Origin'
    }});
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') return response(request, env, { ok: true, service: 'student-auth' }, 200);
    if (request.method !== 'POST' || !['/challenge', '/login'].includes(url.pathname)) return response(request, env, { code: 'not-found', message: 'المسار غير موجود.' }, 404);
    if (!origin || origin !== env.APP_ORIGIN) return response(request, env, { code: 'permission-denied', message: 'يجب استخدام المنصة لتسجيل الدخول.' }, 403);
    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > 16384) return response(request, env, { code: 'invalid-argument', message: 'حجم الطلب أكبر من المسموح.' }, 413);
    if (!String(request.headers.get('Content-Type') || '').toLowerCase().includes('application/json')) {
      return response(request, env, { code: 'invalid-argument', message: 'صيغة الطلب غير صحيحة.' }, 415);
    }
    try {
      const body = await readJson(request);
      const serviceAccount = parseServiceAccount(env);
      const accessToken = await googleAccessToken(serviceAccount);
      const db = new FirestoreRest(serviceAccount.project_id, accessToken);
      const ip = String(request.headers.get('CF-Connecting-IP') || 'unknown').slice(0, 200);
      if (url.pathname === '/challenge') {
        const identity = validateIdentity(body);
        const result = await createLoginChallenge(db, identity.username, identity.deviceId, ip);
        return response(request, env, result, 200);
      }
      const input = validateChallengeInput(body);
      const result = await completeLogin(db, serviceAccount.project_id, accessToken, serviceAccount, input, ip);
      return response(request, env, result, 200);
    } catch (error) {
      const decoded = decodeErrorResponse(error);
      return response(request, env, decoded.body, decoded.status);
    }
  }
};

export {
  ApiError,
  challengeProof,
  constantTimeEqual,
  decodeFirestoreFields,
  encodeFirestoreFields,
  legacyFallbackHash,
  legacyHash,
  parseJsonSequence,
  readJson,
  sha256Hex
};
