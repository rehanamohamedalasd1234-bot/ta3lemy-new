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

exports.teacherApply = callable(async (request) => {
  const uid = requireSignedIn(request);
  const provider = request.auth.token.firebase && request.auth.token.firebase.sign_in_provider;
  const email = cleanText(request.auth.token.email, 160).toLowerCase();
  if (!email || provider === 'anonymous') throw new HttpsError('failed-precondition', 'يجب إنشاء حساب معلم ببريد إلكتروني وكلمة مرور.');
  const data = request.data || {};
  const name = cleanText(data.name, 80);
  const subject = cleanText(data.subject, 80);
  const phone = cleanText(data.phone, 30);
  if (name.length < 2 || subject.length < 2) throw new HttpsError('invalid-argument', 'أدخل اسم المعلم والمادة.');

  const profileRef = db.collection('users').doc(uid);
  const applicationRef = db.collection('teacher_applications').doc(uid);
  await db.runTransaction(async (transaction) => {
    const oldProfile = await transaction.get(profileRef);
    const oldApplication = await transaction.get(applicationRef);
    if (oldProfile.exists && oldProfile.get('role') === 'student') {
      throw new HttpsError('already-exists', 'هذا الحساب مسجل كطالب، استخدم بريدًا آخر لحساب المعلم.');
    }
    if (oldApplication.exists && oldApplication.get('status') === 'approved') {
      throw new HttpsError('already-exists', 'حساب المعلم معتمد بالفعل. سجّل الدخول بدل تقديم طلب جديد.');
    }
    transaction.set(profileRef, {
      name,
      email,
      subject,
      phone,
      role: 'teacher',
      status: 'pending',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    transaction.set(applicationRef, {
      name,
      email,
      subject,
      phone,
      uid,
      status: 'pending',
      createdAt: oldApplication.exists && oldApplication.get('createdAt')
        ? oldApplication.get('createdAt') : admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
  return { ok: true, status: 'pending' };
});

exports.ownerListTeacherApplications = callable(async (request) => {
  requireOwner(request);
  const snap = await db.collection('teacher_applications').where('status', '==', 'pending').limit(100).get();
  return {
    items: snap.docs.map((doc) => {
      const d = doc.data();
      return {
        uid: doc.id,
        name: cleanText(d.name, 80),
        email: cleanText(d.email, 160),
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
  const pendingBefore = await appRef.get();
  if (!pendingBefore.exists || pendingBefore.get('status') !== 'pending') {
    throw new HttpsError('failed-precondition', 'تمت مراجعة طلب المعلم بالفعل.');
  }
  const authUser = await admin.auth().getUser(uid);
  const claims = Object.assign({}, authUser.customClaims || {}, action === 'approve' ? { role: 'teacher' } : { role: 'teacher_pending' });
  await admin.auth().setCustomUserClaims(uid, claims);
  await db.runTransaction(async (transaction) => {
    const app = await transaction.get(appRef);
    if (!app.exists || app.get('status') !== 'pending') throw new HttpsError('failed-precondition', 'تمت مراجعة الطلب أو لم يعد موجودًا.');
    const status = action === 'approve' ? 'active' : 'rejected';
    transaction.update(appRef, { status, reviewedBy: ownerUid, reviewedAt: admin.firestore.FieldValue.serverTimestamp() });
    transaction.set(profileRef, { role: 'teacher', status, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  });
  return { ok: true, status: action === 'approve' ? 'active' : 'rejected' };
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
