/* ترقية بيانات الحسابات القديمة دون تغيير UID أو حذف أي بيانات. */
(function (global) {
  'use strict';

  var CURRENT_DATA_SCHEMA_VERSION = 134;
  var MIGRATION_COLLECTIONS = {
    student: 'users',
    owner: 'users',
    parent: 'users',
    teacher: 'teacher_accounts'
  };

  function now() { return new Date().toISOString(); }

  function firestore() {
    if (!global.firebase || typeof global.firebase.firestore !== 'function') {
      throw new Error('Firestore غير متاح لترقية الحساب');
    }
    return global.firebase.firestore();
  }

  function asVersion(value) {
    var version = Number(value);
    return isFinite(version) && version >= 0 ? Math.floor(version) : 0;
  }

  function safeName(data, fallback) {
    return String(
      data.displayName || data.display_name || data.name || data.email || fallback || 'مستخدم'
    ).trim() || String(fallback || 'مستخدم');
  }

  /* كل خطوة تضيف قيمًا مفقودة فقط؛ لا تستبدل قيم المستخدم القديمة. */
  var migrations = {
    1: function (data, uid, role) {
      var patch = {};
      if (!data.uid) patch.uid = uid;
      if (!data.role && role) patch.role = role;
      if (!data.displayName) patch.displayName = safeName(data, uid);
      if (!data.createdAt) patch.createdAt = now();
      return patch;
    },
    2: function (data) {
      var patch = {};
      if (typeof data.points !== 'number' || !isFinite(data.points)) {
        patch.points = Number(data.points) >= 0 && isFinite(Number(data.points)) ? Number(data.points) : 0;
      }
      if (!data.lastLogin) patch.lastLogin = now();
      return patch;
    },
    3: function (data) {
      var patch = {};
      if (!data.profileVersion) patch.profileVersion = 1;
      if (data.photo_url === undefined && data.photoURL !== undefined) patch.photo_url = data.photoURL;
      return patch;
    },
    4: function (data, uid) {
      var patch = {};
      if (!data.accountUid) patch.accountUid = uid;
      return patch;
    }
  };

  function migrationPatch(data, version, uid, role) {
    var fn = migrations[version];
    return typeof fn === 'function' ? (fn(data, uid, role) || {}) : {};
  }

  async function markFailure(ref, fromVersion, error) {
    try {
      await ref.set({
        migrationStatus: 'failed',
        migrationError: String(error && error.message || error || 'خطأ غير معروف').slice(0, 1000),
        migrationAttemptVersion: fromVersion + 1,
        lastMigrationAt: now()
      }, { merge: true });
    } catch (markError) {
      console.warn('تعذر تسجيل فشل ترقية الحساب:', markError);
    }
  }

  async function migrateAccount(options) {
    options = options || {};
    var uid = String(options.uid || '');
    var role = String(options.role || 'student');
    if (!uid) return { ok: false, skipped: true, reason: 'missing uid' };

    var collection = options.collection || MIGRATION_COLLECTIONS[role] || 'users';
    var ref = firestore().collection(collection).doc(uid);
    var snap = options.snapshot || await ref.get();
    if (!snap.exists) return { ok: false, skipped: true, reason: 'missing account' };

    var data = snap.data() || {};
    var current = asVersion(data.accountVersion !== undefined ? data.accountVersion : data.dataSchemaVersion);
    if (current >= CURRENT_DATA_SCHEMA_VERSION && data.migrationStatus === 'current') {
      return { ok: true, current: true, version: current, data: data };
    }

    var working = Object.assign({}, data);
    var fromVersion = current;
    try {
      await ref.set({
        migrationStatus: 'running',
        migrationError: null,
        migrationStartedAt: now()
      }, { merge: true });

      for (var version = current + 1; version <= CURRENT_DATA_SCHEMA_VERSION; version += 1) {
        var patch = migrationPatch(working, version, uid, role);
        Object.keys(patch).forEach(function (key) {
          if (working[key] === undefined || working[key] === null || key === 'profileVersion') {
            working[key] = patch[key];
          }
        });
      }

      var finalPatch = {
        accountVersion: CURRENT_DATA_SCHEMA_VERSION,
        dataSchemaVersion: CURRENT_DATA_SCHEMA_VERSION,
        migrationStatus: 'current',
        migrationError: null,
        lastMigrationAt: now()
      };
      Object.keys(working).forEach(function (key) {
        if (key !== 'accountVersion' && key !== 'dataSchemaVersion' && key !== 'migrationStatus' && key !== 'migrationError' && key !== 'lastMigrationAt' && key !== 'migrationStartedAt') {
          if (data[key] === undefined || data[key] === null || key === 'uid' || key === 'displayName' || key === 'role' || key === 'points' || key === 'createdAt' || key === 'lastLogin' || key === 'profileVersion' || key === 'photo_url' || key === 'accountUid') {
            finalPatch[key] = working[key];
          }
        }
      });
      await ref.set(finalPatch, { merge: true });
      return { ok: true, current: false, version: CURRENT_DATA_SCHEMA_VERSION, data: Object.assign({}, working, finalPatch) };
    } catch (error) {
      console.error('Account migration failed:', collection, uid, error);
      await markFailure(ref, fromVersion, error);
      return { ok: false, version: fromVersion, error: error };
    }
  }

  async function prepareAccountForEntry(options) {
    options = options || {};
    if (typeof global.showToast === 'function') global.showToast('⏳ جارٍ تحديث بيانات حسابك بأمان...');
    var result;
    try {
      result = await migrateAccount(options);
      if (!result.ok && !result.skipped) console.warn('تم السماح بالدخول رغم تعذر ترقية الحساب.');
    } catch (error) {
      console.error('Unexpected account migration error:', error);
      result = { ok: false, error: error };
    }
    return result;
  }

  global.ACCOUNT_DATA_SCHEMA_VERSION = CURRENT_DATA_SCHEMA_VERSION;
  global.migrateAccount = migrateAccount;
  global.prepareAccountForEntry = prepareAccountForEntry;
  global.markAccountAsCurrent = function (data) {
    var copy = Object.assign({}, data || {});
    copy.accountVersion = CURRENT_DATA_SCHEMA_VERSION;
    copy.dataSchemaVersion = CURRENT_DATA_SCHEMA_VERSION;
    copy.migrationStatus = 'current';
    copy.lastMigrationAt = now();
    return copy;
  };
})(window);
