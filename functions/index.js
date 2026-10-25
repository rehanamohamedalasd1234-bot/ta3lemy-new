const admin = require('firebase-admin');
const { defineSecret } = require('firebase-functions/params');
const { HttpsError, onCall } = require('firebase-functions/v2/https');

admin.initializeApp();
const db = admin.firestore();
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const CREATIVITY_OWNER_UID = defineSecret('CREATIVITY_OWNER_UID');

const REGION = 'us-central1';
const AI_DAILY_LIMIT = 3;
const SUBMISSION_DAILY_LIMIT = 12;
const MAX_INPUT_BASE64_CHARS = 1_600_000;
const MAX_OUTPUT_BASE64_CHARS = 8_000_000;
const CLOUDINARY_NAME = 'bt4sro3h';
const BASE_OPTIONS = {
  region: REGION,
  enforceAppCheck: true,
  maxInstances: 2
};

function requireSignedIn(request) {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'يلزم تسجيل الدخول لإكمال العملية.');
  }
  return request.auth.uid;
}

function requireOwner(request) {
  const uid = requireSignedIn(request);
  const expectedUid = CREATIVITY_OWNER_UID.value();
  if (!expectedUid || uid !== expectedUid) {
    throw new HttpsError('permission-denied', 'هذه الصفحة مخصصة لمالك المنصة.');
  }
  return uid;
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength);
}

function validCloudinaryUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      url.hostname === 'res.cloudinary.com' &&
      url.pathname.startsWith(`/${CLOUDINARY_NAME}/image/upload/`) &&
      /\/creativity\/[^/]+\.(?:png|jpe?g|webp)$/i.test(url.pathname) &&
      url.pathname.length < 1800 && !url.search && !url.hash;
  } catch (_) {
    return false;
  }
}

function validateImageInput(data) {
  const imageBase64 = typeof data.imageBase64 === 'string' ? data.imageBase64 : '';
  const mimeType = data.mimeType;
  if (!['image/png', 'image/jpeg'].includes(mimeType)) {
    throw new HttpsError('invalid-argument', 'صيغة الرسم غير مدعومة.');
  }
  if (!imageBase64 || imageBase64.length > MAX_INPUT_BASE64_CHARS || !/^[A-Za-z0-9+/=]+$/.test(imageBase64)) {
    throw new HttpsError('invalid-argument', 'حجم الرسم غير مناسب للتحويل.');
  }
  return { imageBase64, mimeType };
}

async function consumeDailyLimit(uid, namespace, limit) {
  const day = new Date().toISOString().slice(0, 10);
  const ref = db.collection('creativity_usage').doc(`${namespace}_${uid}_${day}`);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const count = snapshot.exists ? Number(snapshot.get('count') || 0) : 0;
    if (count >= limit) {
      throw new HttpsError('resource-exhausted', 'وصلت إلى الحد اليومي لهذه الميزة. حاول مرة أخرى غدًا.');
    }
    transaction.set(ref, {
      namespace,
      uid,
      day,
      count: count + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
}

function callable(options, handler) {
  return onCall({ ...BASE_OPTIONS, ...options }, handler);
}

exports.creativityEnhance = callable({
  timeoutSeconds: 120,
  memory: '1GiB',
  secrets: [GEMINI_API_KEY]
}, async (request) => {
  const uid = requireSignedIn(request);
  const { imageBase64, mimeType } = validateImageInput(request.data || {});
  await consumeDailyLimit(uid, 'ai', AI_DAILY_LIMIT);

  const prompt = [
    'Create a polished, cheerful artistic version of the student-provided drawing.',
    'Keep the original subject, main shapes, composition, and recognizable details.',
    'Respect the student’s color choices while improving line quality, shading, and finish.',
    'Make it suitable for a school creativity gallery and safe for children.',
    'Do not add words, signatures, logos, watermarks, or unrelated objects.'
  ].join(' ');

  let response;
  try {
    response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY.value(),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gemini-nano-banana-2.1',
        input: [
          { type: 'text', text: prompt },
          { type: 'image', data: imageBase64, mime_type: mimeType }
        ]
      }),
      signal: AbortSignal.timeout(100000)
    });
  } catch (error) {
    console.error('Gemini request failed:', error && error.name);
    throw new HttpsError('unavailable', 'تعذر الاتصال بخدمة تحويل الرسومات الآن.');
  }

  if (!response.ok) {
    console.error('Gemini returned status:', response.status);
    throw new HttpsError('unavailable', 'لم تكتمل عملية تحويل الرسم. حاول مرة أخرى لاحقًا.');
  }

  const result = await response.json();
  let image = result.output_image || null;
  if (!image && Array.isArray(result.steps)) {
    for (const step of result.steps) {
      const block = (step.content || []).find((item) => item.type === 'image' && item.data);
      if (block) { image = block; break; }
    }
  }
  const outputBase64 = image && image.data;
  if (!outputBase64 || outputBase64.length > MAX_OUTPUT_BASE64_CHARS) {
    throw new HttpsError('internal', 'لم تُرجع خدمة الصور نتيجة صالحة.');
  }

  return {
    imageBase64: outputBase64,
    mimeType: (image.mime_type || 'image/png')
  };
});

exports.creativitySubmit = callable({}, async (request) => {
  const uid = requireSignedIn(request);
  const data = request.data || {};
  const title = cleanText(data.title, 100) || 'إبداع طالب';
  const imageUrl = typeof data.imageUrl === 'string' ? data.imageUrl : '';
  const studentName = cleanText(data.studentName, 80);
  if (data.consent !== true) {
    throw new HttpsError('failed-precondition', 'يلزم تسجيل موافقة الطالب على الإرسال والمراجعة.');
  }
  if (!validCloudinaryUrl(imageUrl)) {
    throw new HttpsError('invalid-argument', 'تعذر التحقق من رابط صورة الرسم.');
  }
  await consumeDailyLimit(uid, 'submit', SUBMISSION_DAILY_LIMIT);
  const ref = await db.collection('creativity_requests').add({
    title,
    imageUrl,
    studentId: uid,
    studentName,
    consentGiven: true,
    consentAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: ref.id, status: 'pending' };
});

exports.creativityListGallery = callable({}, async () => {
  const snapshot = await db.collection('creativity_gallery')
    .orderBy('createdAt', 'desc')
    .limit(60)
    .get();
  return {
    items: snapshot.docs.map((doc) => {
      const data = doc.data();
      if (!validCloudinaryUrl(data.imageUrl)) return null;
      return {
        id: doc.id,
        title: cleanText(data.title, 100) || 'إبداع طالب',
        imageUrl: data.imageUrl,
        createdAt: data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : 0
      };
    }).filter(Boolean)
  };
});

exports.creativityListPending = callable({
  secrets: [CREATIVITY_OWNER_UID]
}, async (request) => {
  requireOwner(request);
  const snapshot = await db.collection('creativity_requests')
    .where('status', '==', 'pending')
    .limit(60)
    .get();
  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    if (!validCloudinaryUrl(data.imageUrl)) return null;
    return {
      id: doc.id,
      title: cleanText(data.title, 100) || 'إبداع طالب',
      imageUrl: data.imageUrl,
      studentName: cleanText(data.studentName, 80),
      createdAt: data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : 0
    };
  }).filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
  return { items };
});

exports.creativityListOwnerGallery = callable({
  secrets: [CREATIVITY_OWNER_UID]
}, async (request) => {
  requireOwner(request);
  const snapshot = await db.collection('creativity_gallery')
    .orderBy('createdAt', 'desc')
    .limit(60)
    .get();
  return {
    items: snapshot.docs.map((doc) => {
      const data = doc.data();
      if (!validCloudinaryUrl(data.imageUrl)) return null;
      return {
        id: doc.id,
        title: cleanText(data.title, 100) || 'إبداع طالب',
        imageUrl: data.imageUrl,
        createdAt: data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : 0
      };
    }).filter(Boolean)
  };
});

exports.creativityReview = callable({
  secrets: [CREATIVITY_OWNER_UID]
}, async (request) => {
  const ownerUid = requireOwner(request);
  const data = request.data || {};
  const id = cleanText(data.id, 128);
  const action = data.action;
  if (!id || !['approve', 'reject', 'unpublish'].includes(action)) {
    throw new HttpsError('invalid-argument', 'إجراء المراجعة غير صالح.');
  }

  const requestRef = db.collection('creativity_requests').doc(id);
  const galleryRef = db.collection('creativity_gallery').doc(id);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(requestRef);
    if (!snapshot.exists) throw new HttpsError('not-found', 'الرسم المطلوب غير موجود.');
    const item = snapshot.data();

    if (action === 'approve') {
      if (!validCloudinaryUrl(item.imageUrl)) throw new HttpsError('failed-precondition', 'رابط صورة الرسم غير صالح.');
      if (item.status !== 'pending') throw new HttpsError('failed-precondition', 'تمت مراجعة هذا الرسم بالفعل.');
      transaction.set(galleryRef, {
        title: cleanText(item.title, 100) || 'إبداع طالب',
        imageUrl: item.imageUrl,
        createdAt: item.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        reviewedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      transaction.update(requestRef, {
        status: 'approved',
        reviewedBy: ownerUid,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else if (action === 'reject') {
      if (item.status !== 'pending') throw new HttpsError('failed-precondition', 'تمت مراجعة هذا الرسم بالفعل.');
      transaction.update(requestRef, {
        status: 'rejected',
        reviewedBy: ownerUid,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      transaction.delete(galleryRef);
      transaction.update(requestRef, {
        status: 'hidden',
        reviewedBy: ownerUid,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
  return { ok: true, action };
});

// بوابة المعلم: تسجيل الطلبات، إدارة المحتوى والدرجات عبر تحقق خادمي.
Object.assign(exports, require('./teacher-portal'));
// غرف بث LiveKit: رموز خاصة بالخادم، موافقات لكل غرفة، وإنهاء مجدول.
Object.assign(exports, require('./live-rooms'));
// الدردشة الخاصة: توثيق طلاب المنصة القديمة وتمرير الرسائل عبر تحقق الخادم.
Object.assign(exports, require('./private-chat'));
