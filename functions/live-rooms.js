const admin = require('firebase-admin');
const crypto = require('crypto');
const { defineSecret } = require('firebase-functions/params');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { AccessToken, LiveKitAPI } = require('livekit-server-sdk');

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
const OWNER_UID = defineSecret('CREATIVITY_OWNER_UID');
const LIVEKIT_URL = defineSecret('LIVEKIT_URL');
const LIVEKIT_API_KEY = defineSecret('LIVEKIT_API_KEY');
const LIVEKIT_API_SECRET = defineSecret('LIVEKIT_API_SECRET');
const REGION = 'us-central1';
const LIVEKIT_SECRETS = [LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET];
const CALL_OPTIONS = { region: REGION, enforceAppCheck: true, maxInstances: 3 };
const MIN_DURATION_MINUTES = 15;
const MAX_DURATION_MINUTES = 180;
const DEFAULT_DURATION_MINUTES = 60;
const MAX_ROOM_PARTICIPANTS = 100;
const LIVEKIT_BUILD_TOTAL_PARTICIPANTS = 100;
const ROOM_COLLECTION = 'broadcast_rooms';
const REQUEST_COLLECTION = 'broadcast_join_requests';
const LIVEKIT_OWNER_RESERVED_CONNECTIONS = 1;
const CAPACITY_COLLECTION = 'broadcast_capacity';
const CAPACITY_DOC = 'livekit_global';
const CONTROL_COLLECTION = 'broadcast_control';
const CONTROL_DOC = 'global';
const PARTICIPANT_LEASE_MS = 6 * 60 * 1000;

function callable(handler, secrets) {
  return onCall(Object.assign({}, CALL_OPTIONS, secrets ? { secrets } : {}), handler);
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength);
}

function cleanId(value) {
  const id = cleanText(value, 128);
  return /^[A-Za-z0-9_-]{10,128}$/.test(id) ? id : '';
}

function requireSignedIn(request) {
  const uid = request.auth && request.auth.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'سجّل الدخول أولًا.');
  return uid;
}

function requireOwner(request) {
  const uid = requireSignedIn(request);
  const expectedUid = OWNER_UID.value();
  if (!expectedUid || uid !== expectedUid) {
    throw new HttpsError('permission-denied', 'هذه الصلاحية للمالك فقط.');
  }
  return uid;
}

function requireStudentSession(request) {
  const uid = requireSignedIn(request);
  const provider = request.auth.token && request.auth.token.firebase && request.auth.token.firebase.sign_in_provider;
  if (provider !== 'anonymous') throw new HttpsError('permission-denied', 'يلزم دخول الطالب بجلسة الطالب المجهولة قبل طلب دخول البث.');
  return uid;
}

async function requireTeacher(request) {
  const uid = requireSignedIn(request);
  const snapshot = await db.collection('users').doc(uid).get();
  const profile = snapshot.exists ? snapshot.data() : null;
  if (!profile || profile.role !== 'teacher' || profile.status !== 'active' ||
      !request.auth.token || request.auth.token.role !== 'teacher') {
    throw new HttpsError('permission-denied', 'حساب المعلم غير معتمد أو غير مفعل.');
  }
  return { uid, profile };
}

function stampMillis(value) {
  if (value && typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value === 'number') return value;
  return 0;
}

function roomSummary(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    title: cleanText(data.title, 100),
    subject: cleanText(data.subject, 80),
    teacherId: cleanText(data.teacherId, 128),
    teacherName: cleanText(data.teacherName, 80),
    status: cleanText(data.status, 24),
    durationMinutes: Number(data.durationMinutes) || DEFAULT_DURATION_MINUTES,
    maxParticipants: Number(data.maxParticipants) || 30,
    requestedAt: stampMillis(data.requestedAt),
    reviewedAt: stampMillis(data.reviewedAt),
    startedAt: stampMillis(data.startedAt),
    endsAt: stampMillis(data.endsAt),
    endedAt: stampMillis(data.endedAt),
    endReason: cleanText(data.endReason, 40)
  };
}

function getLiveKitUrl() {
  const raw = LIVEKIT_URL.value().trim();
  if (!raw) throw new HttpsError('failed-precondition', 'لم يُضبط عنوان LiveKit في Firebase Secrets.');
  let url;
  try { url = new URL(raw); } catch (_) {
    throw new HttpsError('failed-precondition', 'عنوان LiveKit غير صالح.');
  }
  if (!['wss:', 'https:'].includes(url.protocol)) {
    throw new HttpsError('failed-precondition', 'استخدم عنوان LiveKit آمنًا يبدأ بـ wss:// أو https://.');
  }
  return raw.replace(/\/+$/, '');
}

function makeLiveKitApi() {
  const raw = getLiveKitUrl();
  const host = raw.replace(/^wss:/i, 'https:');
  const apiKey = LIVEKIT_API_KEY.value();
  const apiSecret = LIVEKIT_API_SECRET.value();
  if (!apiKey || !apiSecret) {
    throw new HttpsError('failed-precondition', 'لم تكتمل مفاتيح LiveKit في Firebase Secrets.');
  }
  return new LiveKitAPI({ host, apiKey, secret: apiSecret });
}

function getWebSocketUrl() {
  const raw = getLiveKitUrl();
  return raw.replace(/^https:/i, 'wss:');
}

function checkRoomTime(data) {
  const duration = Number(data.durationMinutes) || DEFAULT_DURATION_MINUTES;
  if (!Number.isInteger(duration) || duration < MIN_DURATION_MINUTES || duration > MAX_DURATION_MINUTES) {
    throw new HttpsError('invalid-argument', 'مدة الغرفة يجب أن تكون بين 15 و180 دقيقة.');
  }
  return duration;
}

function checkMaxParticipants(value) {
  const count = Number(value) || 30;
  if (!Number.isInteger(count) || count < 2 || count > MAX_ROOM_PARTICIPANTS) {
    throw new HttpsError('invalid-argument', 'سعة الغرفة يجب أن تكون بين 2 و100 مشارك.');
  }
  return count;
}

function getRoomId(data) {
  const id = cleanId(data && data.roomId);
  if (!id) throw new HttpsError('invalid-argument', 'معرّف غرفة البث غير صالح.');
  return id;
}

async function getRoomSnapshot(roomId) {
  const ref = db.collection(ROOM_COLLECTION).doc(roomId);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new HttpsError('not-found', 'غرفة البث غير موجودة.');
  return { ref, snapshot, data: snapshot.data() };
}

async function assertRoomLive(roomId, roomName, startAttemptId) {
  const snapshot = await db.collection(ROOM_COLLECTION).doc(roomId).get();
  if (!snapshot.exists) throw new HttpsError('not-found', 'غرفة البث غير موجودة.');
  const data = snapshot.data();
  if (data.status !== 'live' || stampMillis(data.endsAt) <= Date.now() || (roomName && data.livekitRoomName !== roomName) || (startAttemptId && data.startAttemptId !== startAttemptId)) {
    throw new HttpsError('failed-precondition', 'انتهت الغرفة أو أوقفها المالك.');
  }
  return data;
}

function remainingSeconds(roomData) {
  const remaining = Math.floor((stampMillis(roomData.endsAt) - Date.now()) / 1000);
  if (!Number.isFinite(remaining) || remaining <= 0) {
    throw new HttpsError('failed-precondition', 'انتهى الوقت المحدد لهذه الغرفة.');
  }
  return remaining;
}

async function createParticipantToken(identity, displayName, roomData, role) {
  const apiKey = LIVEKIT_API_KEY.value();
  const apiSecret = LIVEKIT_API_SECRET.value();
  if (!apiKey || !apiSecret) throw new HttpsError('failed-precondition', 'مفاتيح LiveKit غير مضبوطة.');
  const secondsRemaining = remainingSeconds(roomData);
  const ttl = Math.max(1, Math.min(MAX_DURATION_MINUTES * 60, secondsRemaining));
  const token = new AccessToken(apiKey, apiSecret, { identity, ttl });
  token.name = cleanText(displayName, 80) || (role === 'teacher' ? 'المعلم' : role === 'owner' ? 'مالك المنصة' : 'طالب');
  token.addGrant({
    roomJoin: true,
    room: roomData.livekitRoomName,
    roomAdmin: role === 'owner',
    canPublish: role === 'teacher',
    canSubscribe: true,
    canPublishData: false
  });
  return token.toJwt();
}

async function externalParticipantCount(api) {
  const rooms = await api.room.listRooms();
  return rooms.reduce((total, room) => total + (Number(room.numParticipants) || 0), 0);
}

function participantLeaseId(roomId, uid, role) {
  return [role, roomId, uid].join(':');
}

async function reserveParticipantSlot(api, roomId, uid, role, roomData, startAttemptId) {
  const leaseId = participantLeaseId(roomId, uid, role);
  const liveCount = await externalParticipantCount(api);
  let roomParticipants = [];
  try { roomParticipants = await api.room.listParticipants(roomData.livekitRoomName); } catch (_) {}
  const connectedHere = roomParticipants.some((participant) => participant.identity === uid);
  const roomRef = db.collection(ROOM_COLLECTION).doc(roomId);
  const capacityRef = db.collection(CAPACITY_COLLECTION).doc(CAPACITY_DOC);
  const requestRef = role === 'student' ? db.collection(REQUEST_COLLECTION).doc(roomId + '_' + uid) : null;
  let created = false;

  await db.runTransaction(async (transaction) => {
    created = false;
    const roomSnapshot = await transaction.get(roomRef);
    const capacitySnapshot = await transaction.get(capacityRef);
    const requestSnapshot = requestRef ? await transaction.get(requestRef) : null;
    if (!roomSnapshot.exists) throw new HttpsError('not-found', 'غرفة البث غير موجودة.');
    const liveRoom = roomSnapshot.data();
    if (role === 'teacher' && liveRoom.teacherId !== uid) throw new HttpsError('permission-denied', 'هذه الغرفة ليست تابعة لحسابك.');
    if (startAttemptId) {
      if (liveRoom.status !== 'starting' || liveRoom.startAttemptId !== startAttemptId) throw new HttpsError('failed-precondition', 'أُوقف بدء هذه الغرفة أو استُبدلت محاولته.');
    } else if (liveRoom.status !== 'live' || stampMillis(liveRoom.endsAt) <= Date.now()) {
      throw new HttpsError('failed-precondition', 'انتهت الغرفة أو أوقفها المالك.');
    }
    if (role === 'student' && (!requestSnapshot || !requestSnapshot.exists || requestSnapshot.get('status') !== 'approved')) {
      throw new HttpsError('permission-denied', 'يجب أن يوافق المعلم على دخولك أولًا.');
    }

    const now = Date.now();
    const rawLeases = capacitySnapshot.exists && Array.isArray(capacitySnapshot.get('leases')) ? capacitySnapshot.get('leases') : [];
    const leases = rawLeases.filter((lease) => lease && Number(lease.expiresAt) > now);
    const existingIndex = leases.findIndex((lease) => lease.id === leaseId);
    const alreadyReserved = existingIndex >= 0;
    const ownerLeases = leases.filter((lease) => lease.role === 'owner');
    const nonOwnerLeases = leases.filter((lease) => lease.role !== 'owner');

    if (role === 'owner' && !alreadyReserved && ownerLeases.length >= LIVEKIT_OWNER_RESERVED_CONNECTIONS) {
      throw new HttpsError('resource-exhausted', 'اتصال مراقبة المالك مستخدم بالفعل من نافذة أخرى؛ أغلقها قبل مراقبة غرفة ثانية.');
    }
    if (role !== 'owner' && !alreadyReserved && nonOwnerLeases.length >= LIVEKIT_BUILD_TOTAL_PARTICIPANTS - LIVEKIT_OWNER_RESERVED_CONNECTIONS) {
      throw new HttpsError('resource-exhausted', 'وصلت المنصة إلى حد المشاركين المحجوز للمعلمين والطلاب في LiveKit.');
    }
    const isExistingConnection = alreadyReserved || connectedHere;
    if (!isExistingConnection && Math.max(leases.length, liveCount) >= LIVEKIT_BUILD_TOTAL_PARTICIPANTS) {
      throw new HttpsError('resource-exhausted', 'وصل الحد الإجمالي للمشاركين في LiveKit عبر جميع الغرف.');
    }

    const roomEnd = stampMillis(liveRoom.endsAt);
    const expiresAt = Math.min(roomEnd || now + PARTICIPANT_LEASE_MS, now + PARTICIPANT_LEASE_MS);
    const lease = { id: leaseId, roomId, uid, role, expiresAt };
    if (alreadyReserved) leases[existingIndex] = lease;
    else { leases.push(lease); created = true; }
    transaction.set(capacityRef, { leases, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  });
  return { leaseId, created };
}

async function releaseParticipantSlot(roomId, uid, role) {
  const capacityRef = db.collection(CAPACITY_COLLECTION).doc(CAPACITY_DOC);
  const leaseId = participantLeaseId(roomId, uid, role);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(capacityRef);
    if (!snapshot.exists) return;
    const now = Date.now();
    const leases = (Array.isArray(snapshot.get('leases')) ? snapshot.get('leases') : [])
      .filter((lease) => lease && lease.id !== leaseId && Number(lease.expiresAt) > now);
    transaction.set(capacityRef, { leases, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  });
}

async function releaseRoomSlots(roomId) {
  const capacityRef = db.collection(CAPACITY_COLLECTION).doc(CAPACITY_DOC);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(capacityRef);
    if (!snapshot.exists) return;
    const now = Date.now();
    const leases = (Array.isArray(snapshot.get('leases')) ? snapshot.get('leases') : [])
      .filter((lease) => lease && lease.roomId !== roomId && Number(lease.expiresAt) > now);
    transaction.set(capacityRef, { leases, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  });
}

async function renewParticipantSlot(roomId, uid, role) {
  const leaseId = participantLeaseId(roomId, uid, role);
  const roomRef = db.collection(ROOM_COLLECTION).doc(roomId);
  const capacityRef = db.collection(CAPACITY_COLLECTION).doc(CAPACITY_DOC);
  const requestRef = role === 'student' ? db.collection(REQUEST_COLLECTION).doc(roomId + '_' + uid) : null;
  return db.runTransaction(async (transaction) => {
    const roomSnapshot = await transaction.get(roomRef);
    const capacitySnapshot = await transaction.get(capacityRef);
    const requestSnapshot = requestRef ? await transaction.get(requestRef) : null;
    if (!roomSnapshot.exists || roomSnapshot.get('status') !== 'live' || stampMillis(roomSnapshot.get('endsAt')) <= Date.now()) {
      throw new HttpsError('failed-precondition', 'انتهت الغرفة أو أوقفها المالك.');
    }
    if (role === 'teacher' && roomSnapshot.get('teacherId') !== uid) throw new HttpsError('permission-denied', 'هذه الغرفة ليست تابعة لحسابك.');
    if (role === 'student' && (!requestSnapshot || !requestSnapshot.exists || requestSnapshot.get('status') !== 'approved')) {
      throw new HttpsError('permission-denied', 'لم يعد طلب دخولك معتمدًا.');
    }
    if (!capacitySnapshot.exists || !Array.isArray(capacitySnapshot.get('leases'))) return false;
    const now = Date.now();
    const leases = capacitySnapshot.get('leases').filter((lease) => lease && Number(lease.expiresAt) > now);
    const index = leases.findIndex((lease) => lease.id === leaseId);
    if (index < 0) return false;
    const roomEnd = stampMillis(roomSnapshot.get('endsAt'));
    leases[index].expiresAt = Math.min(roomEnd, now + PARTICIPANT_LEASE_MS);
    transaction.set(capacityRef, { leases, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    return true;
  });
}

async function participantDetails(api, roomName) {
  try {
    const participants = await api.room.listParticipants(roomName);
    return participants.map((participant) => ({
      identity: cleanText(participant.identity, 128),
      name: cleanText(participant.name || participant.identity, 80),
      joinedAt: Number(participant.joinedAt) || 0
    }));
  } catch (_) {
    return [];
  }
}

async function ensureLiveRoom(roomData, api) {
  if (!roomData.livekitRoomName) throw new HttpsError('failed-precondition', 'لم يُنشأ اتصال الغرفة بعد.');
  const existing = await api.room.listRooms([roomData.livekitRoomName]);
  if (existing.length) return;
  try {
    await api.room.createRoom({
      name: roomData.livekitRoomName,
      emptyTimeout: 300,
      maxParticipants: Number(roomData.maxParticipants) || 30,
      metadata: JSON.stringify({ roomId: roomData.id || '', title: cleanText(roomData.title, 100) })
    });
  } catch (error) {
    const after = await api.room.listRooms([roomData.livekitRoomName]);
    if (!after.length) throw error;
  }
}

async function deleteLiveKitRoomIfPresent(api, roomName) {
  if (!roomName) return;
  const rooms = await api.room.listRooms([roomName]);
  if (rooms.length) await api.room.deleteRoom(roomName);
}

async function stopRoomRecord(roomId, actorUid, reason, api) {
  const ref = db.collection(ROOM_COLLECTION).doc(roomId);
  let data = null;
  let alreadyEnded = false;
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) throw new HttpsError('not-found', 'غرفة البث غير موجودة.');
    data = snapshot.data();
    if (data.status === 'ended' || data.status === 'rejected') { alreadyEnded = true; return; }
    const latestTokenExpiry = stampMillis(data.endsAt);
    const cleanupUntilMs = data.status === 'live' && latestTokenExpiry > Date.now() ? latestTokenExpiry + 60000 : Date.now() + 60000;
    transaction.update(ref, {
      status: 'ended',
      endedAt: admin.firestore.FieldValue.serverTimestamp(),
      endedBy: actorUid,
      endReason: reason,
      startAttemptId: crypto.randomUUID(),
      cleanupUntil: admin.firestore.Timestamp.fromMillis(cleanupUntilMs),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  try { await releaseRoomSlots(roomId); } catch (error) { console.error('Broadcast slot release failed for', roomId, error && error.message); }
  await deleteLiveKitRoomIfPresent(api, data && data.livekitRoomName);
  return { id: roomId, alreadyEnded };
}

exports.teacherRequestBroadcastRoom = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const data = request.data || {};
  const title = cleanText(data.title, 100);
  const subject = cleanText(data.subject, 80);
  if (title.length < 3 || subject.length < 2) {
    throw new HttpsError('invalid-argument', 'اكتب عنوان الغرفة والمادة.');
  }
  const durationMinutes = checkRoomTime(data);
  const maxParticipants = checkMaxParticipants(data.maxParticipants);
  const ref = await db.collection(ROOM_COLLECTION).add({
    title,
    subject,
    teacherId: teacher.uid,
    teacherName: cleanText(teacher.profile.name || teacher.profile.displayName, 80),
    requestedDurationMinutes: durationMinutes,
    durationMinutes,
    maxParticipants,
    status: 'requested',
    requestedAt: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: ref.id, status: 'requested' };
});

exports.teacherListBroadcastRooms = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const snapshot = await db.collection(ROOM_COLLECTION).where('teacherId', '==', teacher.uid).limit(100).get();
  const items = snapshot.docs.map(roomSummary).sort((a, b) => b.requestedAt - a.requestedAt);
  return { items };
});

exports.ownerListBroadcastRooms = callable(async (request) => {
  requireOwner(request);
  const snapshot = await db.collection(ROOM_COLLECTION).orderBy('requestedAt', 'desc').limit(200).get();
  const api = makeLiveKitApi();
  const items = await Promise.all(snapshot.docs.map(async (doc) => {
    const item = roomSummary(doc);
    item.connectedParticipants = [];
    if (item.status === 'live' && doc.get('livekitRoomName')) {
      item.connectedParticipants = await participantDetails(api, doc.get('livekitRoomName'));
    }
    item.participantCount = item.connectedParticipants.length;
    return item;
  }));
  items.sort((a, b) => (b.requestedAt || b.startedAt) - (a.requestedAt || a.startedAt));
  const active = items.filter((item) => item.status === 'live' || item.status === 'starting');
  let totalConnected = 0;
  try { totalConnected = await externalParticipantCount(api); } catch (_) {}
  return {
    items,
    activeRoomCount: active.length,
    totalConnectedParticipants: totalConnected,
    planParticipantLimit: LIVEKIT_BUILD_TOTAL_PARTICIPANTS
  };
}, [OWNER_UID, ...LIVEKIT_SECRETS]);

exports.ownerReviewBroadcastRoom = callable(async (request) => {
  const ownerUid = requireOwner(request);
  const data = request.data || {};
  const roomId = getRoomId(data);
  const action = data.action;
  if (!['approve', 'reject'].includes(action)) throw new HttpsError('invalid-argument', 'الإجراء غير صالح.');
  const ref = db.collection(ROOM_COLLECTION).doc(roomId);
  let finalStatus = action === 'approve' ? 'approved' : 'rejected';
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists || snapshot.get('status') !== 'requested') {
      throw new HttpsError('failed-precondition', 'تمت مراجعة طلب الغرفة بالفعل أو لم يعد متاحًا.');
    }
    const old = snapshot.data();
    const durationMinutes = action === 'approve'
      ? checkRoomTime({ durationMinutes: data.durationMinutes || old.requestedDurationMinutes })
      : Number(old.requestedDurationMinutes) || DEFAULT_DURATION_MINUTES;
    const maxParticipants = action === 'approve'
      ? checkMaxParticipants(data.maxParticipants || old.maxParticipants)
      : Number(old.maxParticipants) || 30;
    transaction.update(ref, {
      status: finalStatus,
      durationMinutes,
      maxParticipants,
      reviewedBy: ownerUid,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  return { ok: true, status: finalStatus };
}, [OWNER_UID]);

exports.teacherStartBroadcastRoom = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const roomId = getRoomId(request.data || {});
  const ref = db.collection(ROOM_COLLECTION).doc(roomId);
  const controlRef = db.collection(CONTROL_COLLECTION).doc(CONTROL_DOC);
  const startAttemptId = crypto.randomUUID();
  const startedAtMs = Date.now();
  let roomData = null;
  let shouldStart = false;

  await db.runTransaction(async (transaction) => {
    const control = await transaction.get(controlRef);
    if (control.exists && stampMillis(control.get('stopAllUntil')) > Date.now()) {
      throw new HttpsError('aborted', 'المالك يوقف غرف البث حاليًا؛ حاول مرة أخرى بعد قليل.');
    }
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) throw new HttpsError('not-found', 'غرفة البث غير موجودة.');
    const data = snapshot.data();
    if (data.teacherId !== teacher.uid) throw new HttpsError('permission-denied', 'هذه الغرفة ليست تابعة لحسابك.');
    if (data.status === 'live') { roomData = Object.assign({ id: roomId }, data); return; }
    if (data.status === 'starting' && stampMillis(data.startingAt) >= Date.now() - 120000) {
      throw new HttpsError('aborted', 'يجري بدء هذه الغرفة بالفعل؛ انتظر قليلًا ثم حدّث القائمة.');
    }
    if (data.status !== 'approved' && data.status !== 'starting') {
      throw new HttpsError('failed-precondition', 'الغرفة يجب أن يعتمدها المالك قبل بدء البث.');
    }
    const roomName = 'ta3lemy_' + roomId + '_' + startAttemptId.replace(/-/g, '').slice(0, 12);
    const durationMinutes = Number(data.durationMinutes) || DEFAULT_DURATION_MINUTES;
    const endsAtMs = startedAtMs + durationMinutes * 60000;
    const startedAt = admin.firestore.Timestamp.fromMillis(startedAtMs);
    const endsAt = admin.firestore.Timestamp.fromMillis(endsAtMs);
    transaction.update(ref, {
      status: 'starting',
      livekitRoomName: roomName,
      startAttemptId,
      startingAt: startedAt,
      endsAt,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    roomData = Object.assign({}, data, { id: roomId, status: 'starting', livekitRoomName: roomName, startAttemptId, startingAt: startedAt, startedAt, endsAt });
    shouldStart = true;
  });

  const api = makeLiveKitApi();
  let committedLive = false;
  try {
    if (shouldStart) {
      await ensureLiveRoom(roomData, api);
      await reserveParticipantSlot(api, roomId, teacher.uid, 'teacher', roomData, startAttemptId);
      await db.runTransaction(async (transaction) => {
        const fresh = await transaction.get(ref);
        if (!fresh.exists || fresh.get('status') !== 'starting' || fresh.get('startAttemptId') !== startAttemptId) {
          throw new HttpsError('failed-precondition', 'أوقف المالك الغرفة أو تغير طلب بدء البث؛ لم يبدأ البث.');
        }
        transaction.update(ref, {
          status: 'live',
          startedAt: admin.firestore.Timestamp.fromMillis(startedAtMs),
          endsAt: roomData.endsAt,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      roomData.status = 'live';
      committedLive = true;
    } else {
      const fresh = await ref.get();
      if (!fresh.exists || fresh.get('status') !== 'live') throw new HttpsError('failed-precondition', 'لم تعد الغرفة مباشرة.');
      roomData = Object.assign({ id: roomId }, fresh.data());
      await ensureLiveRoom(roomData, api);
      await reserveParticipantSlot(api, roomId, teacher.uid, 'teacher', roomData);
    }

    roomData = await assertRoomLive(roomId, roomData.livekitRoomName, roomData.startAttemptId);
    const token = await createParticipantToken(teacher.uid, teacher.profile.name || teacher.profile.displayName, roomData, 'teacher');
    await assertRoomLive(roomId, roomData.livekitRoomName, roomData.startAttemptId);
    return { roomId, status: 'live', url: getWebSocketUrl(), token, endsAt: stampMillis(roomData.endsAt) };
  } catch (error) {
    if (shouldStart && !committedLive) {
      try {
        await db.runTransaction(async (transaction) => {
          const fresh = await transaction.get(ref);
          if (!fresh.exists || fresh.get('status') !== 'starting' || fresh.get('startAttemptId') !== startAttemptId) return;
          transaction.update(ref, {
            status: 'approved',
            startAttemptId: null,
            startingAt: null,
            startedAt: null,
            endsAt: null,
            lastStartErrorAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        });
      } catch (_) {}
      try { await releaseParticipantSlot(roomId, teacher.uid, 'teacher'); } catch (_) {}
    }
    const latest = await ref.get().catch(() => null);
    if (!committedLive || !latest || !latest.exists || ['ended', 'rejected'].includes(latest.get('status'))) {
      try { await deleteLiveKitRoomIfPresent(api, roomData && roomData.livekitRoomName); } catch (_) {}
    }
    throw error;
  }
}, LIVEKIT_SECRETS);
exports.teacherGetBroadcastToken = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const roomId = getRoomId(request.data || {});
  const result = await getRoomSnapshot(roomId);
  if (result.data.teacherId !== teacher.uid) throw new HttpsError('permission-denied', 'هذه الغرفة ليست تابعة لحسابك.');
  if (result.data.status !== 'live') throw new HttpsError('failed-precondition', 'الغرفة ليست مباشرة الآن.');
  const api = makeLiveKitApi();
  await ensureLiveRoom(Object.assign({ id: roomId }, result.data), api);
  await reserveParticipantSlot(api, roomId, teacher.uid, 'teacher', result.data);
  const token = await createParticipantToken(teacher.uid, teacher.profile.name || teacher.profile.displayName, result.data, 'teacher');
  await assertRoomLive(roomId, result.data.livekitRoomName, result.data.startAttemptId);
  return { roomId, url: getWebSocketUrl(), token, endsAt: stampMillis(result.data.endsAt) };
}, LIVEKIT_SECRETS);

exports.teacherListBroadcastJoinRequests = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const roomId = getRoomId(request.data || {});
  const result = await getRoomSnapshot(roomId);
  if (result.data.teacherId !== teacher.uid) throw new HttpsError('permission-denied', 'هذه الغرفة ليست تابعة لحسابك.');
  const snapshot = await db.collection(REQUEST_COLLECTION).where('roomId', '==', roomId).limit(200).get();
  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      requestId: doc.id,
      studentName: cleanText(data.studentName, 80),
      status: cleanText(data.status, 20),
      createdAt: stampMillis(data.createdAt)
    };
  }).filter((item) => item.status === 'pending').sort((a, b) => a.createdAt - b.createdAt);
  return { items };
});

exports.teacherReviewBroadcastJoinRequest = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const data = request.data || {};
  const roomId = getRoomId(data);
  const requestId = cleanId(data.requestId);
  const action = data.action;
  if (!requestId || requestId.indexOf(roomId + '_') !== 0 || !['approve', 'reject'].includes(action)) throw new HttpsError('invalid-argument', 'بيانات قرار دخول الطالب غير صحيحة.');
  const room = await getRoomSnapshot(roomId);
  if (room.data.teacherId !== teacher.uid || room.data.status !== 'live') {
    throw new HttpsError('permission-denied', 'لا تملك صلاحية مراجعة طلبات هذه الغرفة.');
  }
  const requestRef = db.collection(REQUEST_COLLECTION).doc(requestId);
  const roomRef = db.collection(ROOM_COLLECTION).doc(roomId);
  await db.runTransaction(async (transaction) => {
    const freshRoom = await transaction.get(roomRef);
    const snapshot = await transaction.get(requestRef);
    if (!freshRoom.exists || freshRoom.get('teacherId') !== teacher.uid || freshRoom.get('status') !== 'live' ||
        stampMillis(freshRoom.get('endsAt')) <= Date.now()) {
      throw new HttpsError('failed-precondition', 'انتهت الغرفة أو لم تعد مباشرة؛ لم يُعتمد طلب الدخول.');
    }
    if (!snapshot.exists || snapshot.get('roomId') !== roomId || snapshot.get('status') !== 'pending') {
      throw new HttpsError('failed-precondition', 'تمت مراجعة هذا الطلب أو انتهت الغرفة.');
    }
    transaction.update(requestRef, {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedBy: teacher.uid,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  return { ok: true, status: action === 'approve' ? 'approved' : 'rejected' };
});

exports.studentListLiveBroadcastRooms = callable(async (request) => {
  requireStudentSession(request);
  const snapshot = await db.collection(ROOM_COLLECTION).where('status', '==', 'live').get();
  const items = snapshot.docs.map(roomSummary).filter((item) => item.endsAt > Date.now())
    .sort((a, b) => b.startedAt - a.startedAt);
  return { items };
});

exports.studentRequestBroadcastEntry = callable(async (request) => {
  const uid = requireStudentSession(request);
  const data = request.data || {};
  const roomId = getRoomId(data);
  const studentName = cleanText(data.studentName, 80) || ('طالب ' + uid.slice(0, 5));
  const roomRef = db.collection(ROOM_COLLECTION).doc(roomId);
  const requestRef = db.collection(REQUEST_COLLECTION).doc(roomId + '_' + uid);
  let resultStatus = 'pending';
  await db.runTransaction(async (transaction) => {
    const room = await transaction.get(roomRef);
    if (!room.exists || room.get('status') !== 'live' || stampMillis(room.get('endsAt')) <= Date.now()) {
      throw new HttpsError('failed-precondition', 'هذه الغرفة غير متاحة للدخول الآن.');
    }
    const existing = await transaction.get(requestRef);
    if (existing.exists && existing.get('status') === 'approved') { resultStatus = 'approved'; return; }
    if (existing.exists && existing.get('status') === 'pending') { resultStatus = 'pending'; return; }
    const attempts = existing.exists ? Number(existing.get('attempts') || 0) : 0;
    if (attempts >= 3) throw new HttpsError('resource-exhausted', 'وصلت إلى الحد المسموح لطلبات هذه الغرفة.');
    transaction.set(requestRef, {
      roomId,
      studentUid: uid,
      studentName,
      status: 'pending',
      attempts: attempts + 1,
      createdAt: existing.exists ? existing.get('createdAt') : admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
  return { status: resultStatus };
});

exports.studentGetBroadcastAccess = callable(async (request) => {
  const uid = requireStudentSession(request);
  const roomId = getRoomId(request.data || {});
  const room = await getRoomSnapshot(roomId);
  if (room.data.status !== 'live' || stampMillis(room.data.endsAt) <= Date.now()) {
    return { status: 'ended' };
  }
  const requestRef = db.collection(REQUEST_COLLECTION).doc(roomId + '_' + uid);
  const joinRequest = await requestRef.get();
  if (!joinRequest.exists) return { status: 'none' };
  if (joinRequest.get('status') === 'pending') return { status: 'pending' };
  if (joinRequest.get('status') === 'rejected') return { status: 'rejected' };
  if (joinRequest.get('status') !== 'approved') return { status: 'pending' };

  const api = makeLiveKitApi();
  await ensureLiveRoom(Object.assign({ id: roomId }, room.data), api);
  await reserveParticipantSlot(api, roomId, uid, 'student', room.data);
  const token = await createParticipantToken(uid, joinRequest.get('studentName'), room.data, 'student');
  await assertRoomLive(roomId, room.data.livekitRoomName, room.data.startAttemptId);
  return { status: 'approved', url: getWebSocketUrl(), token, endsAt: stampMillis(room.data.endsAt) };
}, LIVEKIT_SECRETS);

exports.ownerGetBroadcastMonitorToken = callable(async (request) => {
  const ownerUid = requireOwner(request);
  const roomId = getRoomId(request.data || {});
  const room = await getRoomSnapshot(roomId);
  if (room.data.status !== 'live') throw new HttpsError('failed-precondition', 'الغرفة ليست مباشرة الآن.');
  const api = makeLiveKitApi();
  await ensureLiveRoom(Object.assign({ id: roomId }, room.data), api);
  await reserveParticipantSlot(api, roomId, ownerUid, 'owner', room.data);
  const token = await createParticipantToken(ownerUid, 'مالك المنصة', room.data, 'owner');
  await assertRoomLive(roomId, room.data.livekitRoomName, room.data.startAttemptId);
  return { roomId, url: getWebSocketUrl(), token, endsAt: stampMillis(room.data.endsAt) };
}, [OWNER_UID, ...LIVEKIT_SECRETS]);

async function authorizeConnectionRole(request, role) {
  if (role === 'owner') return requireOwner(request);
  if (role === 'teacher') return (await requireTeacher(request)).uid;
  if (role === 'student') return requireStudentSession(request);
  throw new HttpsError('invalid-argument', 'دور اتصال البث غير صالح.');
}

exports.heartbeatBroadcastConnection = callable(async (request) => {
  const data = request.data || {};
  const roomId = getRoomId(data);
  const role = data.role;
  const uid = await authorizeConnectionRole(request, role);
  const room = await getRoomSnapshot(roomId);
  const renewed = await renewParticipantSlot(roomId, uid, role);
  if (!renewed) await reserveParticipantSlot(makeLiveKitApi(), roomId, uid, role, room.data);
  return { ok: true };
}, [OWNER_UID, ...LIVEKIT_SECRETS]);

exports.releaseBroadcastConnection = callable(async (request) => {
  const data = request.data || {};
  const roomId = getRoomId(data);
  const role = data.role;
  const uid = await authorizeConnectionRole(request, role);
  await releaseParticipantSlot(roomId, uid, role);
  return { ok: true };
}, [OWNER_UID]);

exports.teacherEndBroadcastRoom = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const roomId = getRoomId(request.data || {});
  const room = await getRoomSnapshot(roomId);
  if (room.data.teacherId !== teacher.uid) throw new HttpsError('permission-denied', 'هذه الغرفة ليست تابعة لحسابك.');
  const result = await stopRoomRecord(roomId, teacher.uid, 'teacher_ended', makeLiveKitApi());
  return { ok: true, id: result.id };
}, LIVEKIT_SECRETS);

exports.ownerStopBroadcastRoom = callable(async (request) => {
  const ownerUid = requireOwner(request);
  const roomId = getRoomId(request.data || {});
  const result = await stopRoomRecord(roomId, ownerUid, 'owner_stopped', makeLiveKitApi());
  return { ok: true, id: result.id, alreadyEnded: result.alreadyEnded };
}, [OWNER_UID, ...LIVEKIT_SECRETS]);

exports.ownerStopAllBroadcastRooms = callable(async (request) => {
  const ownerUid = requireOwner(request);
  const api = makeLiveKitApi();
  const controlRef = db.collection(CONTROL_COLLECTION).doc(CONTROL_DOC);
  const stopAllLockId = crypto.randomUUID();
  const stopAllUntil = admin.firestore.Timestamp.fromMillis(Date.now() + 5 * 60 * 1000);
  await db.runTransaction(async (transaction) => {
    const control = await transaction.get(controlRef);
    if (control.exists && stampMillis(control.get('stopAllUntil')) > Date.now()) {
      throw new HttpsError('aborted', 'يوجد أمر إيقاف شامل آخر قيد التنفيذ؛ انتظر قليلًا ثم أعد المحاولة.');
    }
    transaction.set(controlRef, {
      stopAllLockId,
      stopAllUntil,
      stopAllStartedBy: ownerUid,
      stopAllStartedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

  try {
    const snapshot = await db.collection(ROOM_COLLECTION).where('status', 'in', ['live', 'starting']).get();
    const outcomes = await Promise.all(snapshot.docs.map(async (doc) => {
      try {
        await stopRoomRecord(doc.id, ownerUid, 'owner_stopped_all', api);
        return { ok: true, id: doc.id };
      } catch (_) {
        return { ok: false, id: doc.id };
      }
    }));
    return {
      ok: outcomes.every((item) => item.ok),
      ended: outcomes.filter((item) => item.ok).length,
      failed: outcomes.filter((item) => !item.ok).length
    };
  } finally {
    await db.runTransaction(async (transaction) => {
      const control = await transaction.get(controlRef);
      if (control.exists && control.get('stopAllLockId') === stopAllLockId) {
        transaction.set(controlRef, { stopAllLockId: null, stopAllUntil: null }, { merge: true });
      }
    });
  }
}, [OWNER_UID, ...LIVEKIT_SECRETS]);

exports.expireLiveBroadcastRooms = onSchedule({
  schedule: 'every 1 minutes',
  region: REGION,
  maxInstances: 1,
  timeoutSeconds: 120,
  secrets: LIVEKIT_SECRETS
}, async () => {
  const now = Date.now();
  const snapshot = await db.collection(ROOM_COLLECTION).where('status', '==', 'live').get();
  const api = makeLiveKitApi();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.endsAt || stampMillis(data.endsAt) > now) continue;
    try {
      await stopRoomRecord(doc.id, 'system', 'duration_expired', api);
    } catch (error) {
      console.error('LiveKit room expiration failed for', doc.id, error && error.message);
    }
  }

  const cleanupSnapshot = await db.collection(ROOM_COLLECTION)
    .where('cleanupUntil', '>', admin.firestore.Timestamp.fromMillis(Date.now())).get();
  for (const doc of cleanupSnapshot.docs) {
    if (doc.get('status') !== 'ended') continue;
    try { await deleteLiveKitRoomIfPresent(api, doc.get('livekitRoomName')); }
    catch (error) { console.error('LiveKit ended-room cleanup failed for', doc.id, error && error.message); }
  }
});
