/* إدارة الاستقصاءات والتصويت باستخدام معرّف حساب المنصة. */
(function (global) {
  'use strict';

  var MAX_OPTIONS = 6;
  var MAX_QUESTION_LENGTH = 300;
  var MAX_OPTION_LENGTH = 120;

  function store() {
    if (!global.firebase || typeof global.firebase.firestore !== 'function') {
      throw new Error('خدمة قاعدة البيانات غير متاحة.');
    }
    return global.firebase.firestore();
  }

  function appUser() { return global.currentUser || null; }
  function accountUid() {
    var user = appUser();
    return user && user.uid ? String(user.uid) : '';
  }
  function role() {
    var user = appUser() || {};
    return String(global.currentRole || user.role || '').toLowerCase();
  }
  function isOwnerRole() { return !!appUser() && role() === 'owner'; }
  function toast(message) {
    if (typeof global.showToast === 'function') global.showToast(message);
  }
  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = String(value == null ? '' : value);
  }
  function setDisplay(id, value) {
    var element = document.getElementById(id);
    if (element) element.style.display = value;
  }
  function ownerStatus(message, isError) {
    var element = document.getElementById('pollOwnerAuthStatus');
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? '#B71C1C' : '#315c3b';
  }

  async function requireVerifiedOwner() {
    if (!isOwnerRole()) throw new Error('إدارة الاستقصاءات متاحة لمالك المنصة فقط.');
    if (!global.HafezOwnerAuth || typeof global.HafezOwnerAuth.getVerifiedSession !== 'function') {
      throw new Error('خدمة التحقق من بريد المالك غير جاهزة. حدّث الصفحة وحاول مجددًا.');
    }
    var session = await global.HafezOwnerAuth.getVerifiedSession();
    if (!session || !session.access_token || !session.user) {
      throw new Error('يجب التحقق من بريد المالك أولًا باستخدام رابط التحقق.');
    }
    var verifiedEmail = String(session.user.email || '').trim().toLowerCase();
    var ownerEmail = String(global.HafezOwnerAuth.ownerEmail || '').trim().toLowerCase();
    if (!verifiedEmail || (ownerEmail && verifiedEmail !== ownerEmail)) {
      throw new Error('جلسة التحقق ليست لحساب مالك المنصة.');
    }
    return session;
  }

  function openPoll() {
    if (!accountUid()) {
      toast('⚠️ سجّل الدخول إلى حسابك أولًا للمشاركة في الاستقصاء.');
      return;
    }
    var modal = document.getElementById('pollModal');
    if (!modal) return;
    modal.style.display = 'flex';
    loadActivePoll();
  }

  async function loadActivePoll() {
    var questionElement = document.getElementById('pollQuestionText');
    var optionsContainer = document.getElementById('pollOptionsContainer');
    var resultsContainer = document.getElementById('pollResultsContainer');
    if (!questionElement || !optionsContainer || !resultsContainer) return;

    questionElement.textContent = 'جاري تحميل الاستقصاء...';
    optionsContainer.innerHTML = '';
    optionsContainer.style.display = 'none';
    resultsContainer.style.display = 'none';

    try {
      var snapshot = await store().collection('polls').where('isActive', '==', true).limit(1).get();
      if (snapshot.empty) {
        questionElement.textContent = 'لا يوجد استقصاء حاليًا.';
        return;
      }
      var pollDoc = snapshot.docs[0];
      var poll = pollDoc.data() || {};
      var options = Array.isArray(poll.options) ? poll.options : [];
      if (!poll.question || options.length < 2) {
        questionElement.textContent = 'الاستقصاء غير مكتمل. يرجى التواصل مع إدارة المنصة.';
        return;
      }
      questionElement.textContent = String(poll.question);
      options.forEach(function (option, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = String(option);
        button.style.cssText = 'display:block;width:100%;padding:12px;margin-bottom:8px;border:1px solid #ccc;border-radius:8px;background:#f8f9fa;cursor:pointer;font:inherit;font-size:16px;text-align:right;';
        button.addEventListener('click', function () { submitVote(pollDoc.id, index); });
        optionsContainer.appendChild(button);
      });

      var alreadyVoted = await checkIfVoted(pollDoc.id);
      if (alreadyVoted) showResults(pollDoc.id);
      else optionsContainer.style.display = 'block';
    } catch (error) {
      console.error('loadActivePoll:', error);
      questionElement.textContent = 'تعذر تحميل الاستقصاء. تحقق من اتصال الإنترنت وقواعد Firestore.';
    }
  }

  async function submitVote(pollId, optionIndex) {
    var uid = accountUid();
    if (!uid) {
      toast('⚠️ سجّل الدخول إلى حسابك أولًا للمشاركة.');
      return;
    }
    var buttons = document.querySelectorAll('#pollOptionsContainer button');
    Array.prototype.forEach.call(buttons, function (button) { button.disabled = true; });

    try {
      var db = store();
      var pollRef = db.collection('polls').doc(String(pollId));
      // وثيقة واحدة لكل حساب منصة ولكل استقصاء، مع تحديث عدّاد النتائج في معاملة واحدة.
      var voteRef = pollRef.collection('votes').doc(uid);
      var outcome = await db.runTransaction(async function (transaction) {
        var pollSnapshot = await transaction.get(pollRef);
        var voteSnapshot = await transaction.get(voteRef);
        if (!pollSnapshot.exists) return { missing: true };
        if (voteSnapshot.exists) return { alreadyVoted: true };

        var poll = pollSnapshot.data() || {};
        var options = Array.isArray(poll.options) ? poll.options : [];
        if (poll.isActive !== true) return { inactive: true };
        if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= options.length) {
          return { invalidOption: true };
        }

        var results = Object.assign({}, poll.results || {});
        var oldCount = Number(results[optionIndex] || 0);
        results[optionIndex] = isFinite(oldCount) && oldCount >= 0 ? oldCount + 1 : 1;
        transaction.set(voteRef, {
          accountUid: uid,
          optionIndex: optionIndex,
          timestamp: global.firebase.firestore.FieldValue.serverTimestamp()
        });
        transaction.update(pollRef, {
          results: results,
          updatedAt: global.firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true };
      });

      if (outcome.alreadyVoted) {
        toast('لقد شارك هذا الحساب في الاستقصاء بالفعل.');
        showResults(pollId);
      } else if (outcome.inactive || outcome.missing) {
        toast('انتهى هذا الاستقصاء أو لم يعد متاحًا.');
        loadActivePoll();
      } else if (outcome.invalidOption) {
        toast('الخيار المحدد غير صالح. حدّث الاستقصاء وحاول مجددًا.');
        loadActivePoll();
      } else {
        toast('✅ تم تسجيل تصويتك.');
        showResults(pollId);
      }
    } catch (error) {
      console.error('submitVote:', error);
      toast('❌ تعذر حفظ التصويت. تحقق من الاتصال وقواعد Firestore.');
      Array.prototype.forEach.call(buttons, function (button) { button.disabled = false; });
    }
  }

  async function checkIfVoted(pollId) {
    var uid = accountUid();
    if (!uid) return false;
    try {
      var vote = await store().collection('polls').doc(String(pollId)).collection('votes').doc(uid).get();
      return vote.exists;
    } catch (error) {
      console.warn('checkIfVoted:', error);
      throw error;
    }
  }

  async function showResults(pollId) {
    var optionsContainer = document.getElementById('pollOptionsContainer');
    var resultsContainer = document.getElementById('pollResultsContainer');
    var barsContainer = document.getElementById('pollResultsBars');
    if (optionsContainer) optionsContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';
    if (barsContainer) barsContainer.innerHTML = '';

    try {
      var snapshot = await store().collection('polls').doc(String(pollId)).get();
      if (!snapshot.exists) {
        setText('pollQuestionText', 'لم يعد هذا الاستقصاء متاحًا.');
        return;
      }
      var data = snapshot.data() || {};
      var options = Array.isArray(data.options) ? data.options : [];
      var results = data.results || {};
      var total = Object.keys(results).reduce(function (sum, key) {
        var count = Number(results[key] || 0);
        return sum + (isFinite(count) && count > 0 ? count : 0);
      }, 0);
      if (!barsContainer) return;

      options.forEach(function (option, index) {
        var count = Number(results[index] || 0);
        if (!isFinite(count) || count < 0) count = 0;
        var percent = total === 0 ? 0 : Math.round((count / total) * 100);
        var row = document.createElement('div');
        row.style.cssText = 'margin-bottom:12px;';
        var heading = document.createElement('div');
        heading.style.cssText = 'display:flex;justify-content:space-between;gap:8px;font-size:14px;margin-bottom:4px;';
        var label = document.createElement('span');
        label.textContent = String(option);
        var number = document.createElement('span');
        number.textContent = percent + '% (' + count + ')';
        heading.appendChild(label);
        heading.appendChild(number);
        var track = document.createElement('div');
        track.style.cssText = 'background:#e0e0e0;border-radius:5px;overflow:hidden;height:12px;';
        var bar = document.createElement('div');
        bar.style.cssText = 'background:#4CAF50;width:' + percent + '%;height:100%;';
        track.appendChild(bar);
        row.appendChild(heading);
        row.appendChild(track);
        barsContainer.appendChild(row);
      });
      setText('pollTotalVotes', 'إجمالي المشاركات: ' + total);
    } catch (error) {
      console.error('showResults:', error);
      setText('pollTotalVotes', 'تعذر تحميل النتائج حاليًا.');
    }
  }

  function openPollAdmin() {
    if (!isOwnerRole()) {
      toast('⚠️ لوحة إدارة الاستقصاء متاحة لمالك المنصة فقط.');
      return;
    }
    if (Array.isArray(global.screenHistory)) global.screenHistory.push(global.currentScreen || 'homeScreen');
    if (typeof global.showScreen === 'function') global.showScreen('pollAdminScreen');
    setDisplay('pollAdminContent', 'none');
    setDisplay('pollAdminOwnerVerification', 'block');
    refreshPollAdminAccess();
  }

  async function refreshPollAdminAccess() {
    if (!isOwnerRole()) {
      ownerStatus('هذه اللوحة متاحة لمالك المنصة فقط.', true);
      setDisplay('pollAdminContent', 'none');
      setDisplay('pollAdminOwnerVerification', 'block');
      return false;
    }
    ownerStatus('جارٍ التحقق من جلسة المالك...', false);
    try {
      await requireVerifiedOwner();
      setDisplay('pollAdminOwnerVerification', 'none');
      setDisplay('pollAdminContent', 'block');
      await loadPollAdminList();
      return true;
    } catch (error) {
      setDisplay('pollAdminContent', 'none');
      setDisplay('pollAdminOwnerVerification', 'block');
      ownerStatus(error.message || 'يجب التحقق من بريد المالك قبل إدارة الاستقصاءات.', true);
      return false;
    }
  }

  async function requestPollOwnerVerification() {
    if (!isOwnerRole()) {
      ownerStatus('هذه اللوحة متاحة لمالك المنصة فقط.', true);
      return;
    }
    if (!global.HafezOwnerAuth || typeof global.HafezOwnerAuth.requestMagicLink !== 'function') {
      ownerStatus('خدمة التحقق من بريد المالك غير متاحة. حدّث الصفحة وحاول مجددًا.', true);
      return;
    }
    ownerStatus('جارٍ إرسال رابط التحقق إلى البريد المعتمد للمالك...', false);
    try {
      await global.HafezOwnerAuth.requestMagicLink('pollOwnerAuthStatus');
    } catch (error) {
      ownerStatus(error.message || 'تعذر إرسال رابط التحقق.', true);
    }
  }

  async function loadPollAdminList() {
    var container = document.getElementById('pollAdminList');
    if (!container) return;
    container.textContent = 'جارٍ تحميل الاستقصاءات...';
    try {
      await requireVerifiedOwner();
      var snapshot = await store().collection('polls').limit(100).get();
      var items = snapshot.docs.map(function (doc) {
        return { id: doc.id, data: doc.data() || {} };
      });
      items.sort(function (left, right) {
        return timestampValue(right.data.createdAt) - timestampValue(left.data.createdAt);
      });
      container.innerHTML = '';
      if (!items.length) {
        container.textContent = 'لم تُنشأ استقصاءات بعد. اكتب سؤالًا جديدًا بالأعلى.';
        return;
      }
      items.forEach(function (item) { container.appendChild(pollAdminCard(item)); });
    } catch (error) {
      console.error('loadPollAdminList:', error);
      container.textContent = 'تعذر تحميل الاستقصاءات. تحقق من اتصال الإنترنت وقواعد Firestore.';
    }
  }

  function timestampValue(value) {
    if (value && typeof value.toMillis === 'function') return value.toMillis();
    if (value && typeof value.toDate === 'function') return value.toDate().getTime();
    var parsed = Date.parse(value || '');
    return isFinite(parsed) ? parsed : 0;
  }

  function pollAdminCard(item) {
    var data = item.data || {};
    var card = document.createElement('section');
    card.style.cssText = 'background:#fff;border:1px solid #e2e8e3;border-radius:14px;padding:14px;margin:10px 0;box-shadow:0 2px 8px rgba(0,0,0,.05);';
    var question = document.createElement('div');
    question.textContent = String(data.question || 'سؤال بلا عنوان');
    question.style.cssText = 'font-weight:700;line-height:1.7;color:#17352d;margin-bottom:8px;';
    var results = data.results || {};
    var total = Object.keys(results).reduce(function (sum, key) {
      var count = Number(results[key] || 0);
      return sum + (isFinite(count) && count > 0 ? count : 0);
    }, 0);
    var state = document.createElement('div');
    state.textContent = (data.isActive === true ? '🟢 مفعّل' : '⚪ موقوف') + ' · ' + total + ' تصويت';
    state.style.cssText = 'font-size:13px;color:#68756d;margin-bottom:10px;';
    card.appendChild(question);
    card.appendChild(state);

    var options = Array.isArray(data.options) ? data.options : [];
    options.forEach(function (option, index) {
      var resultRow = document.createElement('div');
      resultRow.textContent = String(option) + ' — ' + Number(results[index] || 0);
      resultRow.style.cssText = 'font-size:13px;color:#526b57;margin:4px 0;';
      card.appendChild(resultRow);
    });

    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = data.isActive === true ? 'إيقاف الاستقصاء' : 'تفعيل هذا الاستقصاء';
    button.style.cssText = 'margin-top:10px;padding:9px 14px;border:0;border-radius:8px;background:' + (data.isActive === true ? '#8f2b2b' : '#2e7d32') + ';color:#fff;font:inherit;font-weight:700;cursor:pointer;';
    button.addEventListener('click', function () {
      setPollActiveState(item.id, data.isActive !== true, button);
    });
    card.appendChild(button);
    return card;
  }

  async function createPollFromAdmin() {
    var questionElement = document.getElementById('pollAdminQuestion');
    var optionsElement = document.getElementById('pollAdminOptions');
    var saveButton = document.getElementById('pollAdminSaveButton');
    if (!questionElement || !optionsElement) return;
    var question = questionElement.value.trim();
    var options = optionsElement.value.split(/\r?\n/).map(function (value) { return value.trim(); }).filter(Boolean);
    if (!question || question.length > MAX_QUESTION_LENGTH) {
      toast('اكتب سؤالًا من 1 إلى ' + MAX_QUESTION_LENGTH + ' حرفًا.');
      return;
    }
    if (options.length < 2 || options.length > MAX_OPTIONS) {
      toast('أدخل من خيارين إلى ' + MAX_OPTIONS + ' خيارات، كل خيار في سطر مستقل.');
      return;
    }
    if (options.some(function (option) { return option.length > MAX_OPTION_LENGTH; })) {
      toast('يجب ألا يزيد طول الخيار الواحد عن ' + MAX_OPTION_LENGTH + ' حرفًا.');
      return;
    }
    var normalized = options.map(function (option) { return option.toLocaleLowerCase(); });
    if (new Set(normalized).size !== options.length) {
      toast('يوجد خيار مكرر. احذف التكرار قبل الحفظ.');
      return;
    }

    if (saveButton) { saveButton.disabled = true; saveButton.textContent = 'جارٍ النشر...'; }
    try {
      await requireVerifiedOwner();
      var db = store();
      var activeSnapshot = await db.collection('polls').where('isActive', '==', true).limit(450).get();
      if (activeSnapshot.size >= 450) throw new Error('عدد الاستقصاءات المفعّلة غير معتاد. أوقف بعضها ثم أعد المحاولة.');
      var batch = db.batch();
      var now = global.firebase.firestore.FieldValue.serverTimestamp();
      activeSnapshot.forEach(function (doc) {
        batch.update(doc.ref, { isActive: false, updatedAt: now });
      });
      var results = {};
      options.forEach(function (_option, index) { results[index] = 0; });
      var pollRef = db.collection('polls').doc();
      batch.set(pollRef, {
        question: question,
        options: options,
        results: results,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        createdByPlatformUid: accountUid(),
        createdByRole: 'owner'
      });
      await batch.commit();
      questionElement.value = '';
      optionsElement.value = '';
      toast('✅ تم نشر الاستقصاء الجديد وإيقاف الاستقصاء السابق.');
      await loadPollAdminList();
    } catch (error) {
      console.error('createPollFromAdmin:', error);
      toast(error.message || '❌ تعذر نشر الاستقصاء. تحقق من قواعد Firestore.');
    } finally {
      if (saveButton) { saveButton.disabled = false; saveButton.textContent = '📊 نشر الاستقصاء'; }
    }
  }

  async function setPollActiveState(pollId, activate, button) {
    if (button) { button.disabled = true; button.textContent = 'جارٍ التحديث...'; }
    try {
      await requireVerifiedOwner();
      var db = store();
      var targetRef = db.collection('polls').doc(String(pollId));
      var target = await targetRef.get();
      if (!target.exists) throw new Error('لم يعد هذا الاستقصاء موجودًا.');
      if (!activate) {
        await targetRef.update({ isActive: false, updatedAt: global.firebase.firestore.FieldValue.serverTimestamp() });
      } else {
        var activeSnapshot = await db.collection('polls').where('isActive', '==', true).limit(450).get();
        if (activeSnapshot.size >= 450) throw new Error('عدد الاستقصاءات المفعّلة غير معتاد. أوقف بعضها ثم أعد المحاولة.');
        var batch = db.batch();
        var now = global.firebase.firestore.FieldValue.serverTimestamp();
        activeSnapshot.forEach(function (doc) {
          if (doc.id !== String(pollId)) batch.update(doc.ref, { isActive: false, updatedAt: now });
        });
        batch.update(targetRef, { isActive: true, updatedAt: now });
        await batch.commit();
      }
      toast(activate ? '✅ تم تفعيل الاستقصاء.' : 'تم إيقاف الاستقصاء.');
      await loadPollAdminList();
    } catch (error) {
      console.error('setPollActiveState:', error);
      toast(error.message || '❌ تعذر تحديث حالة الاستقصاء.');
      if (button) { button.disabled = false; button.textContent = activate ? 'تفعيل هذا الاستقصاء' : 'إيقاف الاستقصاء'; }
    }
  }

  global.openPoll = openPoll;
  global.loadActivePoll = loadActivePoll;
  global.submitVote = submitVote;
  global.checkIfVoted = checkIfVoted;
  global.showResults = showResults;
  global.openPollAdmin = openPollAdmin;
  global.refreshPollAdminAccess = refreshPollAdminAccess;
  global.requestPollOwnerVerification = requestPollOwnerVerification;
  global.loadPollAdminList = loadPollAdminList;
  global.createPollFromAdmin = createPollFromAdmin;
  global.setPollActiveState = setPollActiveState;

  global.addEventListener('ta3lemy-owner-auth-changed', function () {
    if (global.currentScreen === 'pollAdminScreen') refreshPollAdminAccess();
  });
})(window);
