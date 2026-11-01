const admin = require('firebase-admin');
const crypto = require('node:crypto');
const { defineSecret } = require('firebase-functions/params');
const { HttpsError, onCall } = require('firebase-functions/v2/https');

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
const OWNER_UID = defineSecret('CREATIVITY_OWNER_UID');
const REGION = 'us-central1';
const CALL_OPTIONS = { region: REGION, enforceAppCheck: true, maxInstances: 3 };
const CONVERSATION_COLLECTION = 'private_conversations';
const AUTH_LIMIT_COLLECTION = 'private_chat_auth_limits';
const SEND_LIMIT_COLLECTION = 'private_chat_send_limits';
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES_PER_MINUTE = 24;

function callable(handler, secrets) {
  return onCall(Object.assign({}, CALL_OPTIONS, secrets ? { secrets } : {}), handler);
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function cleanUid(value) {
  const uid = cleanText(value, 128);
  return /^[A-Za-z0-9_-]{1,128}$/.test(uid) ? uid : '';
}

function requireSignedIn(request) {
  const uid = request.auth && request.auth.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'سجّل الدخول لاستخدام المحادثات الخاصة.');
  return uid;
}

function millis(value) {
  if (value && typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value === 'number') return value;
  return 0;
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ''), 'utf8');
  const b = Buffer.from(String(right || ''), 'utf8');
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
}

function legacyPasswordHashes(password, salt) {
  const source = salt + '|' + password + '|hafez_secure';
  const sha = crypto.createHash('sha256').update(source, 'utf8').digest('hex');
  let h1 = 5381;
  let h2 = 52711;
  for (let i = 0; i < source.length; i += 1) {
    h1 = ((h1 * 33) ^ source.charCodeAt(i)) >>> 0;
    h2 = ((h2 * 31) ^ source.charCodeAt(i)) >>> 0;
  }
  return [sha, 'f_' + h1.toString(16) + h2.toString(16)];
}

async function limitLegacyAuthAttempts(uid, ip) {
  const key = crypto.createHash('sha256').update(uid + '|' + (ip || 'unknown')).digest('hex').slice(0, 40);
  const ref = db.collection(AUTH_LIMIT_COLLECTION).doc(key);
  const now = Date.now();
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const startedAt = snapshot.exists ? millis(snapshot.get('windowStartedAt')) : 0;
    const oldCount = snapshot.exists ? Number(snapshot.get('count') || 0) : 0;
    const count = now - startedAt < 15 * 60 * 1000 ? oldCount : 0;
    if (count >= 12) {
      throw new HttpsError('resource-exhausted', 'محاولات دخول كثيرة. انتظر 15 دقيقة ثم حاول مرة أخرى.');
    }
    transaction.set(ref, {
      count: count + 1,
      windowStartedAt: admin.firestore.Timestamp.fromMillis(count ? startedAt : now),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
}

async function findProfile(uid) {
  const clean = cleanUid(uid);
  if (!clean) return null;
  const snapshot = await db.collection('users').doc(clean).get();
  return snapshot.exists ? Object.assign({ uid: clean }, snapshot.data()) : null;
}

async function requireChatIdentity(request) {
  const uid = requireSignedIn(request);
  const ownerUid = OWNER_UID.value();
  if (ownerUid && uid === ownerUid) return { uid, role: 'owner', name: 'مالك المنصة' };
  const profile = await findProfile(uid);
  const claims = request.auth.token || {};
  if (profile && profile.role === 'teacher' && profile.status === 'active' && claims.role === 'teacher') {
    return { uid, role: 'teacher', name: cleanText(profile.name || profile.displayName, 80) || 'معلم' };
  }
  if (profile && profile.role === 'student' && claims.legacyStudent === true && claims.platformRole === 'student') {
    return { uid, role: 'student', name: cleanText(profile.name, 80) || 'طالب' };
  }
  throw new HttpsError('permission-denied', 'يلزم حساب طالب موثق أو حساب معلم معتمد. سجّل الخروج ثم ادخل بالحساب من جديد.');
}

function profileRole(profile) {
  if (!profile) return '';
  if (profile.role === 'teacher' && profile.status === 'active') return 'teacher';
  if (profile.role === 'student') return 'student';
  return '';
}

async function resolveTarget(targetUid) {
  const ownerUid = OWNER_UID.value();
  if (ownerUid && targetUid === ownerUid) return { uid: ownerUid, role: 'owner', name: 'مالك المنصة' };
  const profile = await findProfile(targetUid);
  const role = profileRole(profile);
  if (!role) throw new HttpsError('not-found', 'الحساب غير متاح للمحادثة.');
  return { uid: targetUid, role, name: cleanText(profile.name || profile.displayName, 80) || (role === 'teacher' ? 'معلم' : 'طالب') };
}

function conversationIdFor(uidA, uidB) {
  return crypto.createHash('sha256').update([uidA, uidB].sort().join('|')).digest('hex');
}

async function verifyMembership(request, conversationId) {
  const identity = await requireChatIdentity(request);
  const id = cleanText(conversationId, 64);
  if (!/^[a-f0-9]{64}$/.test(id)) throw new HttpsError('invalid-argument', 'معرّف المحادثة غير صالح.');
  const ref = db.collection(CONVERSATION_COLLECTION).doc(id);
  const snapshot = await ref.get();
  if (!snapshot.exists || !Array.isArray(snapshot.get('participants')) || !snapshot.get('participants').includes(identity.uid)) {
    throw new HttpsError('permission-denied', 'هذه المحادثة غير متاحة لحسابك.');
  }
  return { identity, ref, data: snapshot.data() };
}

exports.privateChatAuthenticateLegacy = callable(async (request) => {
  const data = request.data || {};
  const uid = cleanUid(data.uid);
  const password = typeof data.password === 'string' ? data.password : '';
  if (!uid || password.length < 4 || password.length > 256) {
    throw new HttpsError('invalid-argument', 'بيانات الدخول غير صحيحة.');
  }
  await limitLegacyAuthAttempts(uid, request.rawRequest && request.rawRequest.ip);
  const snapshot = await db.collection('users').doc(uid).get();
  const profile = snapshot.exists ? snapshot.data() : null;
  const hashes = profile && profile.salt ? legacyPasswordHashes(password, profile.salt) : [];
  const storedHash = profile && profile.passHash;
  const validPassword = hashes.some((hash) => safeEqual(hash, storedHash));
  if (!profile || profile.role !== 'student' || !validPassword) {
    throw new HttpsError('unauthenticated', 'تعذر تفعيل الجلسة الآمنة للدردشة. تأكد من اسم المستخدم وكلمة المرور.');
  }
  const token = await admin.auth().createCustomToken(uid, { platformRole: 'student', legacyStudent: true });
  return { token };
});

exports.privateChatFindContacts = callable(async (request) => {
  const identity = await requireChatIdentity(request);
  const query = cleanText((request.data || {}).name, 80);
  if (query.length < 2) throw new HttpsError('invalid-argument', 'اكتب اسمًا من حرفين على الأقل.');
  const snapshot = await db.collection('users').where('name', '==', query).limit(20).get();
  const items = snapshot.docs.map((doc) => {
    const profile = doc.data();
    const role = profileRole(profile);
    if (!role || doc.id === identity.uid) return null;
    return { uid: doc.id, name: cleanText(profile.name || profile.displayName, 80) || 'مستخدم', role };
  }).filter(Boolean);
  const normalizedQuery = query.toLowerCase();
  const ownerUid = OWNER_UID.value();
  if (ownerUid && identity.uid !== ownerUid && ['مالك', 'المالك', 'مالك المنصة', 'owner'].includes(normalizedQuery)) {
    items.push({ uid: ownerUid, name: 'مالك المنصة', role: 'owner' });
  }
  return { items: items.slice(0, 20) };
}, [OWNER_UID]);

exports.privateChatOpen = callable(async (request) => {
  const identity = await requireChatIdentity(request);
  const targetUid = cleanUid((request.data || {}).targetUid);
  if (!targetUid || targetUid === identity.uid) throw new HttpsError('invalid-argument', 'اختر حسابًا آخر لبدء المحادثة.');
  const target = await resolveTarget(targetUid);
  const participants = [identity.uid, targetUid].sort();
  const id = conversationIdFor(identity.uid, targetUid);
  const ref = db.collection(CONVERSATION_COLLECTION).doc(id);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists) {
      const stored = snapshot.get('participants') || [];
      if (stored.length !== 2 || stored[0] !== participants[0] || stored[1] !== participants[1]) {
        throw new HttpsError('failed-precondition', 'تعذر التحقق من أطراف المحادثة.');
      }
      return;
    }
    const names = {};
    names[identity.uid] = identity.name;
    names[target.uid] = target.name;
    transaction.create(ref, {
      participants,
      participantNames: names,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastMessage: '',
      lastSenderId: '',
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  return { id, target: { uid: target.uid, name: target.name, role: target.role } };
}, [OWNER_UID]);

exports.privateChatListConversations = callable(async (request) => {
  const identity = await requireChatIdentity(request);
  const snapshot = await db.collection(CONVERSATION_COLLECTION)
    .where('participants', 'array-contains', identity.uid)
    .limit(100)
    .get();
  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    const otherUid = (data.participants || []).find((uid) => uid !== identity.uid) || '';
    const names = data.participantNames || {};
    return {
      id: doc.id,
      withId: otherUid,
      withName: cleanText(names[otherUid], 80) || 'مستخدم',
      lastMessage: cleanText(data.lastMessage, 160),
      lastMessageAt: millis(data.lastMessageAt)
    };
  }).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  return { items };
}, [OWNER_UID]);

exports.privateChatListMessages = callable(async (request) => {
  const result = await verifyMembership(request, (request.data || {}).conversationId);
  const snapshot = await result.ref.collection('items').orderBy('createdAt', 'desc').limit(80).get();
  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      senderId: cleanUid(data.senderId),
      text: cleanText(data.text, MAX_MESSAGE_LENGTH),
      createdAt: millis(data.createdAt)
    };
  }).reverse();
  return { items };
}, [OWNER_UID]);

exports.privateChatSendMessage = callable(async (request) => {
  const identity = await requireChatIdentity(request);
  const data = request.data || {};
  const conversationId = cleanText(data.conversationId, 64);
  const text = cleanText(data.text, MAX_MESSAGE_LENGTH);
  if (!/^[a-f0-9]{64}$/.test(conversationId) || !text) throw new HttpsError('invalid-argument', 'اكتب رسالة نصية قبل الإرسال.');
  const conversationRef = db.collection(CONVERSATION_COLLECTION).doc(conversationId);
  const rateRef = db.collection(SEND_LIMIT_COLLECTION).doc(crypto.createHash('sha256').update(identity.uid).digest('hex'));
  const messageRef = conversationRef.collection('items').doc();
  const now = Date.now();
  await db.runTransaction(async (transaction) => {
    const conversation = await transaction.get(conversationRef);
    const rate = await transaction.get(rateRef);
    const participants = conversation.exists ? conversation.get('participants') : [];
    if (!conversation.exists || !Array.isArray(participants) || !participants.includes(identity.uid) || participants.length !== 2) {
      throw new HttpsError('permission-denied', 'لا تملك صلاحية الإرسال في هذه المحادثة.');
    }
    const windowStartedAt = rate.exists ? millis(rate.get('windowStartedAt')) : 0;
    const oldCount = rate.exists ? Number(rate.get('count') || 0) : 0;
    const count = now - windowStartedAt < 60 * 1000 ? oldCount : 0;
    if (count >= MAX_MESSAGES_PER_MINUTE) throw new HttpsError('resource-exhausted', 'أرسلت رسائل كثيرة بسرعة. انتظر دقيقة ثم حاول.');
    transaction.create(messageRef, {
      senderId: identity.uid,
      text,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    transaction.update(conversationRef, {
      lastMessage: text.slice(0, 160),
      lastSenderId: identity.uid,
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp()
    });
    transaction.set(rateRef, {
      count: count + 1,
      windowStartedAt: admin.firestore.Timestamp.fromMillis(count ? windowStartedAt : now),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  return { ok: true, id: messageRef.id, createdAt: now };
}, [OWNER_UID]);
