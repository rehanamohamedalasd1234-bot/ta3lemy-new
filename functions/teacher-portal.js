const admin = require('firebase-admin');
const crypto = require('node:crypto');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
const OWNER_UID = defineSecret('CREATIVITY_OWNER_UID');
const CLOUDINARY_API_KEY = defineSecret('CLOUDINARY_API_KEY');
const CLOUDINARY_API_SECRET = defineSecret('CLOUDINARY_API_SECRET');
const CLOUDINARY_NAME = 'bt4sro3h';
const REGION = 'us-central1';
const BASE_OPTIONS = { region: REGION, enforceAppCheck: true, maxInstances: 3 };
const CONTENT_TYPES = ['lesson', 'exercise', 'exam', 'video'];
const STAGES = ['primary', 'prep', 'sec'];

function callable(handler, secrets) {
  return onCall(Object.assign({}, BASE_OPTIONS, secrets ? { secrets } : {}), handler);
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength);
}

function normalizeTeacherUsername(value) {
  const username = cleanText(value, 80).normalize('NFKC').toLowerCase();
  if (!/^[\p{L}\p{N}._-]{3,40}$/u.test(username)) {
    throw new HttpsError('invalid-argument', 'اسم الدخول يجب أن يكون من 3 إلى 40 حرفًا أو رقمًا، من دون مسافات.');
  }
  return username;
}

function teacherLoginEmail(username) {
  const digest = crypto.createHash('sha256').update(username, 'utf8').digest('hex');
  return 'teacher-' + digest + '@teachers.ta3lemt-hafez.firebaseapp.com';
}

function requireSignedIn(request) {
  const uid = request.auth && request.auth.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'سجّل الدخول أولًا.');
  return uid;
}

function requireOwner(request) {
  const uid = requireSignedIn(request);
  const expected = OWNER_UID.value();
  if (!expected || uid !== expected) throw new HttpsError('permission-denied', 'هذه الصلاحية للمالك فقط.');
  return uid;
}

async function requireTeacher(request) {
  const uid = requireSignedIn(request);
  const snap = await db.collection('users').doc(uid).get();
  const profile = snap.exists ? snap.data() : null;
  if (!profile || profile.role !== 'teacher' || profile.status !== 'active' || request.auth.token.role !== 'teacher') {
    throw new HttpsError('permission-denied', 'حساب المعلم غير معتمد أو غير مفعل.');
  }
  return { uid, profile };
}

function millis(value) {
  if (value && typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value === 'number') return value;
  return 0;
}

function serializeContent(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    title: cleanText(data.title, 120),
    subject: cleanText(data.subject, 80),
    stage: cleanText(data.stage, 40),
    grade: cleanText(data.grade, 60),
    term: Number(data.term) || 1,
    type: CONTENT_TYPES.includes(data.type) ? data.type : 'lesson',
    content: cleanText(data.content, 15000),
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : '',
    videoUrl: typeof data.videoUrl === 'string' ? data.videoUrl : '',
    teacherId: cleanText(data.teacherId, 128),
    teacherName: cleanText(data.teacherName, 80),
    status: cleanText(data.status, 20),
    createdAt: millis(data.createdAt)
  };
}

function validTeacherAssetUrl(value, uid, resourceType) {
  if (!value) return true;
  try {
    const url = new URL(value);
    const prefix = '/' + CLOUDINARY_NAME + '/' + resourceType + '/upload/';
    const folder = '/teacher_content/' + uid + '/';
    return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com' &&
      url.pathname.indexOf(prefix) === 0 && url.pathname.indexOf(folder) > prefix.length &&
      !url.search && !url.hash && url.pathname.length < 1800;
  } catch (_) {
    return false;
  }
}

function ratingFor(score) {
  if (score >= 90) return 'ممتاز';
  if (score >= 80) return 'جيد جدًا';
  if (score >= 65) return 'جيد';
  if (score >= 50) return 'مقبول';
  return 'يحتاج متابعة';
}

exports.portalResolveAccess = callable(async (request) => {
  const uid = requireSignedIn(request);
  const expectedOwner = OWNER_UID.value();
  if (expectedOwner && uid === expectedOwner) return { role: 'owner', status: 'active', name: 'مالك المنصة' };
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) throw new HttpsError('permission-denied', 'الحساب غير مسجل في المنصة.');
  const profile = snap.data();
  if (profile.role === 'teacher') {
    return {
      role: 'teacher',
      status: profile.status === 'active' && request.auth.token.role === 'teacher'
        ? 'active' : (profile.status === 'rejected' ? 'rejected' : 'pending'),
      name: cleanText(profile.name || profile.displayName, 80),
      subject: cleanText(profile.subject, 80)
    };
  }
  throw new HttpsError('permission-denied', 'لا توجد صلاحية لهذا الحساب.');
}, [OWNER_UID]);

// يعيد عنوانًا اصطناعيًا غير قابل لعكس اسم الدخول. كلمة المرور لا تمر بهذه الوظيفة؛
// Firebase Auth يتحقق منها مباشرة عبر signInWithEmailAndPassword في الواجهة.
exports.teacherResolveLoginName = callable(async (request) => {
  const username = normalizeTeacherUsername((request.data || {}).username);
  return { email: teacherLoginEmail(username) };
});

exports.ownerListTeacherAccounts = callable(async (request) => {
  requireOwner(request);
  const snapshot = await db.collection('users').where('role', '==', 'teacher').limit(100).get();
  return {
    items: snapshot.docs.map((doc) => {
      const profile = doc.data();
      return {
        uid: doc.id,
        name: cleanText(profile.name || profile.displayName, 80),
        subject: cleanText(profile.subject, 80),
        status: cleanText(profile.status, 20),
        username: cleanText(profile.username, 40),
        phone: cleanText(profile.phone, 30)
      };
    }).sort((a, b) => a.name.localeCompare(b.name, 'ar'))
  };
}, [OWNER_UID]);

exports.ownerSetTeacherCredentials = callable(async (request) => {
  requireOwner(request);
  const data = request.data || {};
  const uid = cleanText(data.uid, 128);
  const username = normalizeTeacherUsername(data.username);
  const password = typeof data.password === 'string' ? data.password : '';
  const name = cleanText(data.name, 80);
  const subject = cleanText(data.subject, 80);
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(uid) || password.length < 8 || password.length > 128 || name.length < 2) {
    throw new HttpsError('invalid-argument', 'أدخل المعلم واسم الدخول وكلمة مرور من 8 أحرف على الأقل.');
  }
  const profileRef = db.collection('users').doc(uid);
  const profileSnap = await profileRef.get();
  if (!profileSnap.exists || profileSnap.get('role') !== 'teacher') {
    throw new HttpsError('not-found', 'حساب المعلم غير موجود في قائمة المنصة.');
  }
  const email = teacherLoginEmail(username);
  try {
    const existing = await admin.auth().getUserByEmail(email);
    if (existing.uid !== uid) throw new HttpsError('already-exists', 'اسم الدخول مستخدم لمعلم آخر.');
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    if (error.code !== 'auth/user-not-found') throw error;
  }
  const authUser = await admin.auth().getUser(uid);
  await admin.auth().updateUser(uid, { email, password, displayName: name });
  const claims = Object.assign({}, authUser.customClaims || {}, {
    role: profileSnap.get('status') === 'active' ? 'teacher' : 'teacher_pending'
  });
  await admin.auth().setCustomUserClaims(uid, claims);
  await profileRef.set({
    name,
    username,
    email,
    subject: subject || cleanText(profileSnap.get('subject'), 80),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  return { ok: true, username, status: cleanText(profileSnap.get('status'), 20) };
}, [OWNER_UID]);

exports.ownerCreateTeacherAccount = callable(async (request) => {
  requireOwner(request);
  const data = request.data || {};
  const name = cleanText(data.name, 80);
  const username = normalizeTeacherUsername(data.username);
  const password = typeof data.password === 'string' ? data.password : '';
  const subject = cleanText(data.subject, 80);
  const phone = cleanText(data.phone, 30);
  if (name.length < 2 || subject.length < 2 || password.length < 8 || password.length > 128) {
    throw new HttpsError('invalid-argument', 'أكمل الاسم والمادة وكلمة مرور من 8 أحرف على الأقل.');
  }
  const email = teacherLoginEmail(username);
  try {
    await admin.auth().getUserByEmail(email);
    throw new HttpsError('already-exists', 'اسم الدخول مستخدم بالفعل. اختر اسمًا آخر.');
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    if (error.code !== 'auth/user-not-found') throw error;
  }
  const authUser = await admin.auth().createUser({ email, password, displayName: name });
  try {
    await admin.auth().setCustomUserClaims(authUser.uid, { role: 'teacher_pending' });
    const now = admin.firestore.FieldValue.serverTimestamp();
    const batch = db.batch();
    batch.set(db.collection('users').doc(authUser.uid), {
      name, username, email, subject, phone,
      role: 'teacher', status: 'pending',
      createdAt: now, updatedAt: now
    });
    batch.set(db.collection('teacher_applications').doc(authUser.uid), {
      uid: authUser.uid, name, username, email, subject, phone,
      status: 'pending', createdAt: now, updatedAt: now
    });
    await batch.commit();
  } catch (error) {
    await admin.auth().deleteUser(authUser.uid).catch(() => {});
    throw error;
  }
  return { ok: true, uid: authUser.uid, username, status: 'pending' };
}, [OWNER_UID]);

exports.ownerListTeacherApplications = callable(async (request) => {
  requireOwner(request);
  const snap = await db.collection('teacher_applications').where('status', '==', 'pending').limit(100).get();
  return {
    items: snap.docs.map((doc) => {
      const d = doc.data();
      return {
        uid: doc.id,
        name: cleanText(d.name, 80),
        email: /^teacher-[a-f0-9]{64}@teachers\.ta3lemt-hafez\.firebaseapp\.com$/i.test(String(d.email || '')) ? '' : cleanText(d.email, 160),
        username: cleanText(d.username, 40),
        subject: cleanText(d.subject, 80),
        phone: cleanText(d.phone, 30),
        createdAt: millis(d.createdAt)
      };
    }).sort((a, b) => b.createdAt - a.createdAt)
  };
}, [OWNER_UID]);

exports.ownerReviewTeacherApplication = callable(async (request) => {
  const ownerUid = requireOwner(request);
  const data = request.data || {};
  const uid = cleanText(data.uid, 128);
  const action = data.action;
  if (!uid || !['approve', 'reject'].includes(action)) throw new HttpsError('invalid-argument', 'الإجراء غير صالح.');
  const appRef = db.collection('teacher_applications').doc(uid);
  const profileRef = db.collection('users').doc(uid);
  const desiredStatus = action === 'approve' ? 'active' : 'rejected';
  await db.runTransaction(async (transaction) => {
    const app = await transaction.get(appRef);
    const profile = await transaction.get(profileRef);
    if (!app.exists) throw new HttpsError('not-found', 'طلب المعلم غير موجود.');
    const currentStatus = app.get('status');
    if (currentStatus === 'pending') {
      transaction.update(appRef, {
        status: desiredStatus,
        reviewedBy: ownerUid,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      transaction.set(profileRef, {
        role: 'teacher',
        status: desiredStatus,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } else if (currentStatus !== desiredStatus || !profile.exists || profile.get('status') !== desiredStatus) {
      throw new HttpsError('failed-precondition', 'تمت مراجعة طلب المعلم بالفعل بإجراء مختلف.');
    }
  });
  // حدّث العلامة بعد تثبيت قرار قاعدة البيانات؛ إذا فشل Auth في هذه الخطوة،
  // إعادة نفس الإجراء من المالك تعيد مزامنة العلامة دون السماح بعكس القرار.
  const authUser = await admin.auth().getUser(uid);
  const claims = Object.assign({}, authUser.customClaims || {}, desiredStatus === 'active' ? { role: 'teacher' } : { role: 'teacher_pending' });
  await admin.auth().setCustomUserClaims(uid, claims);
  return { ok: true, status: desiredStatus };
}, [OWNER_UID]);

exports.teacherCreateUploadSignature = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const data = request.data || {};
  const resourceType = data.resourceType === 'video' ? 'video' : data.resourceType === 'image' ? 'image' : '';
  if (!resourceType) throw new HttpsError('invalid-argument', 'نوع الملف غير مدعوم.');
  const apiKey = CLOUDINARY_API_KEY.value();
  const apiSecret = CLOUDINARY_API_SECRET.value();
  if (!apiKey || !apiSecret) throw new HttpsError('failed-precondition', 'لم يكتمل إعداد الرفع الآمن في Cloudinary.');
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'teacher_content/' + teacher.uid;
  const toSign = 'folder=' + folder + '&timestamp=' + timestamp;
  const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
  return {
    apiKey,
    cloudName: CLOUDINARY_NAME,
    resourceType,
    timestamp,
    folder,
    signature,
    uploadUrl: 'https://api.cloudinary.com/v1_1/' + CLOUDINARY_NAME + '/' + resourceType + '/upload'
  };
}, [CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET]);

exports.teacherSubmitContent = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const data = request.data || {};
  const type = CONTENT_TYPES.includes(data.type) ? data.type : '';
  const stage = STAGES.includes(data.stage) ? data.stage : '';
  const grade = cleanText(data.grade, 60);
  const subject = cleanText(data.subject, 80);
  const title = cleanText(data.title, 120);
  const content = cleanText(data.content, 15000);
  const term = Number(data.term);
  const imageUrl = typeof data.imageUrl === 'string' ? data.imageUrl : '';
  const videoUrl = typeof data.videoUrl === 'string' ? data.videoUrl : '';
  if (!type || !stage || !grade || !subject || !title || ![1, 2].includes(term)) {
    throw new HttpsError('invalid-argument', 'أكمل نوع المحتوى والمرحلة والصف والمادة والعنوان والترم.');
  }
  if (!content && !imageUrl && !videoUrl) throw new HttpsError('invalid-argument', 'أضف شرحًا نصيًا أو صورة أو فيديو.');
  if (!validTeacherAssetUrl(imageUrl, teacher.uid, 'image') || !validTeacherAssetUrl(videoUrl, teacher.uid, 'video')) {
    throw new HttpsError('invalid-argument', 'تعذر التحقق من رابط الصورة أو الفيديو المرفوع.');
  }
  const ref = await db.collection('teacher_uploads').add({
    teacherId: teacher.uid,
    teacherName: cleanText(teacher.profile.name, 80),
    type,
    stage,
    grade,
    subject,
    term,
    title,
    content,
    imageUrl,
    videoUrl,
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: ref.id, status: 'pending' };
});

exports.teacherListMyContent = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const snap = await db.collection('teacher_uploads').where('teacherId', '==', teacher.uid).limit(60).get();
  return { items: snap.docs.map(serializeContent).sort((a, b) => b.createdAt - a.createdAt) };
});

exports.ownerListTeacherContent = callable(async (request) => {
  requireOwner(request);
  const snap = await db.collection('teacher_uploads').where('status', '==', 'pending').limit(100).get();
  return { items: snap.docs.map(serializeContent).sort((a, b) => b.createdAt - a.createdAt) };
}, [OWNER_UID]);

exports.ownerReviewTeacherContent = callable(async (request) => {
  const ownerUid = requireOwner(request);
  const data = request.data || {};
  const id = cleanText(data.id, 128);
  const action = data.action;
  if (!id || !['approve', 'reject'].includes(action)) throw new HttpsError('invalid-argument', 'الإجراء غير صالح.');
  const uploadRef = db.collection('teacher_uploads').doc(id);
  const lessonRef = db.collection('lessons').doc(id);
  await db.runTransaction(async (transaction) => {
    const upload = await transaction.get(uploadRef);
    if (!upload.exists || upload.get('status') !== 'pending') throw new HttpsError('failed-precondition', 'تمت مراجعة هذا المحتوى بالفعل.');
    const item = upload.data();
    if (action === 'approve') {
      const typeMap = { lesson: 'lessons', exercise: 'exercises', exam: 'exams', video: 'videos' };
      transaction.set(lessonRef, {
        title: item.title,
        content: item.content || '',
        subject: item.subject,
        stage: item.stage,
        grade: item.grade,
        term: Number(item.term) || 1,
        type: typeMap[item.type] || 'lessons',
        image_url: item.imageUrl || null,
        video_url: item.videoUrl || null,
        created_at: new Date().toISOString(),
        teacher_id: item.teacherId,
        teacher_name: item.teacherName,
        approved_by: ownerUid
      });
    }
    transaction.update(uploadRef, {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedBy: ownerUid,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  return { ok: true, status: action === 'approve' ? 'approved' : 'rejected' };
}, [OWNER_UID]);

exports.teacherListStudents = callable(async (request) => {
  await requireTeacher(request);
  const snap = await db.collection('users').where('role', '==', 'student').limit(300).get();
  return {
    items: snap.docs.map((doc) => {
      const d = doc.data();
      return { id: doc.id, name: cleanText(d.name, 60), stage: cleanText(d.stage, 40), grade: cleanText(d.grade, 60) };
    }).sort((a, b) => a.name.localeCompare(b.name, 'ar'))
  };
});

exports.teacherSaveGrade = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const data = request.data || {};
  const studentId = cleanText(data.studentId, 128);
  const title = cleanText(data.title, 120);
  const subject = cleanText(data.subject, 80);
  const feedback = cleanText(data.feedback, 1200);
  const score = Number(data.score);
  if (!studentId || !title || !subject || !Number.isFinite(score) || score < 0 || score > 100) {
    throw new HttpsError('invalid-argument', 'اختر الطالب واكتب اسم التقييم والمادة ودرجة من 0 إلى 100.');
  }
  const studentRef = db.collection('users').doc(studentId);
  const student = await studentRef.get();
  if (!student.exists || student.get('role') !== 'student') throw new HttpsError('not-found', 'الطالب غير موجود.');
  const ref = db.collection('teacher_grades').doc();
  const rounded = Math.round(score * 10) / 10;
  await ref.set({
    teacherId: teacher.uid,
    teacherName: cleanText(teacher.profile.name, 80),
    studentId,
    studentName: cleanText(student.get('name'), 60),
    assessmentTitle: title,
    subject,
    score: rounded,
    rating: ratingFor(rounded),
    feedback,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: ref.id, score: rounded, rating: ratingFor(rounded) };
});

exports.teacherListMyGrades = callable(async (request) => {
  const teacher = await requireTeacher(request);
  const snap = await db.collection('teacher_grades').where('teacherId', '==', teacher.uid).limit(100).get();
  const items = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      studentId: cleanText(d.studentId, 128),
      studentName: cleanText(d.studentName, 60),
      assessmentTitle: cleanText(d.assessmentTitle, 120),
      subject: cleanText(d.subject, 80),
      score: Number(d.score) || 0,
      rating: cleanText(d.rating, 40),
      feedback: cleanText(d.feedback, 1200),
      createdAt: millis(d.createdAt)
    };
  }).sort((a, b) => b.createdAt - a.createdAt);
  return { items };
});
