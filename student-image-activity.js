(function () {
  'use strict';

  var activity = { lessonId: '', pages: [], choice: '' };
  var MAX_POINTS = 12000;
  var DRAFT_PREFIX = 'ta3lemy_student_answer_draft_v2:';
  var resizeListenerAttached = false;

  function draftKey() { return DRAFT_PREFIX + String(activity.lessonId || ''); }
  function readDraft() {
    try {
      var raw = localStorage.getItem(draftKey());
      var value = raw ? JSON.parse(raw) : null;
      return value && typeof value === 'object' ? value : null;
    } catch (_) { return null; }
  }
  function saveDraft() {
    if (!activity.lessonId) return;
    try {
      var textarea = document.getElementById('studentAnswer');
      var submission = getSubmission();
      localStorage.setItem(draftKey(), JSON.stringify({
        answer: textarea ? String(textarea.value || '').slice(0, 5000) : '',
        choice: submission.choice || '',
        annotations: submission.annotations || [],
        updatedAt: Date.now()
      }));
    } catch (_) {}
  }
  function clearDraft() { try { localStorage.removeItem(draftKey()); } catch (_) {} }
  function restoreDraft() {
    var draft = readDraft();
    if (!draft) return;
    var textarea = document.getElementById('studentAnswer');
    if (textarea && draft.answer) textarea.value = String(draft.answer);
    activity.choice = String(draft.choice || '');
    if (Array.isArray(draft.annotations)) {
      draft.annotations.forEach(function (saved) {
        var page = activity.pages.find(function (item) { return item.index === Number(saved.pageIndex); });
        if (!page || !Array.isArray(saved.strokes)) return;
        page.strokes = saved.strokes.slice(0, 120).map(function (stroke) {
          return { color: '#d32f2f', points: Array.isArray(stroke.points) ? stroke.points.slice(0, 1800) : [] };
        }).filter(function (stroke) { return stroke.points.length; });
        drawPage(page);
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll('.image-activity-choice'), function (button) {
      var selected = button.textContent.indexOf(activity.choice) >= 0;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  function drawPage(page) {
    var rect = page.stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    var width = Math.round(rect.width * dpr);
    var height = Math.round(rect.height * dpr);
    if (page.canvas.width !== width || page.canvas.height !== height) {
      page.canvas.width = width;
      page.canvas.height = height;
    }
    var ctx = page.canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = Math.max(3, rect.width / 260);
    page.strokes.forEach(function (stroke) {
      if (!stroke.points.length) return;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0][0] * rect.width, stroke.points[0][1] * rect.height);
      stroke.points.slice(1).forEach(function (point) {
        ctx.lineTo(point[0] * rect.width, point[1] * rect.height);
      });
      if (stroke.points.length === 1) {
        ctx.lineTo(stroke.points[0][0] * rect.width + 0.1, stroke.points[0][1] * rect.height + 0.1);
      }
      ctx.stroke();
    });
  }

  function init(root, lessonId) {
    activity = { lessonId: String(lessonId), pages: [], choice: '' };
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('.teacher-image-activity-canvas'), function (canvas) {
      var stage = canvas.parentElement;
      var image = stage && stage.querySelector('.teacher-gallery-page-image');
      if (!stage || !image) return;
      var page = {
        index: Number(canvas.getAttribute('data-gallery-index')) || 0,
        canvas: canvas,
        stage: stage,
        image: image,
        strokes: [],
        active: false,
        currentStroke: null
      };
      activity.pages.push(page);
      var resize = function () { drawPage(page); };
      if (image.complete) requestAnimationFrame(resize);
      else image.addEventListener('load', resize, { once: true });
      canvas.addEventListener('pointerdown', function (event) {
        if (!page.active) return;
        event.preventDefault();
        var rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        page.currentStroke = { color: '#d32f2f', points: [[(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height]] };
        page.strokes.push(page.currentStroke);
        if (page.strokes.length > 120) page.strokes.shift();
        canvas.setPointerCapture(event.pointerId);
        drawPage(page);
      });
      canvas.addEventListener('pointermove', function (event) {
        if (!page.active || !page.currentStroke) return;
        event.preventDefault();
        var rect = canvas.getBoundingClientRect();
        var x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        var y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        var points = page.currentStroke.points;
        var previous = points[points.length - 1];
        var dx = (x - previous[0]) * rect.width;
        var dy = (y - previous[1]) * rect.height;
        if (Math.sqrt(dx * dx + dy * dy) >= 1.5 && points.length < 1800) {
          points.push([x, y]);
          drawPage(page);
        }
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (eventName) {
        canvas.addEventListener(eventName, function () { page.currentStroke = null; saveDraft(); });
      });
    });
    var textarea = document.getElementById('studentAnswer');
    if (textarea) textarea.addEventListener('input', saveDraft);
    restoreDraft();
    if (!resizeListenerAttached) {
      window.addEventListener('resize', function () { activity.pages.forEach(drawPage); }, { passive: true });
      resizeListenerAttached = true;
    }
  }

  function toggle(index, button) {
    var page = activity.pages.find(function (item) { return item.index === Number(index); });
    if (!page) return;
    page.active = !page.active;
    page.canvas.style.pointerEvents = page.active ? 'auto' : 'none';
    page.canvas.style.cursor = page.active ? 'crosshair' : 'zoom-in';
    if (button) {
      button.setAttribute('aria-pressed', page.active ? 'true' : 'false');
      button.classList.toggle('is-selected', page.active);
      button.textContent = page.active ? '✓ انتهيت من الكتابة' : '✍️ اكتب على الصورة';
    }
  }

  function undo(index) {
    var page = activity.pages.find(function (item) { return item.index === Number(index); });
    if (!page) return;
    page.strokes.pop();
    page.currentStroke = null;
    drawPage(page);
  }

  function clear(index) {
    var page = activity.pages.find(function (item) { return item.index === Number(index); });
    if (!page) return;
    page.strokes = [];
    page.currentStroke = null;
    drawPage(page);
  }

  function choose(value, button) {
    activity.choice = value;
    saveDraft();
    var root = button && button.closest('.teacher-image-answer-tools');
    if (root) {
      Array.prototype.forEach.call(root.querySelectorAll('.image-activity-choice'), function (item) {
        var selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    }
  }

  function getSubmission() {
    var budget = MAX_POINTS;
    var annotations = activity.pages.map(function (page) {
      var strokes = page.strokes.map(function (stroke) {
        if (!budget || !stroke.points.length) return null;
        var stride = Math.max(1, Math.ceil(stroke.points.length / budget));
        var points = stroke.points.filter(function (_, index) { return index % stride === 0; }).slice(0, budget);
        budget -= points.length;
        return points.length ? { color: stroke.color, points: points.map(function (point) { return [Number(point[0].toFixed(3)), Number(point[1].toFixed(3))]; }) } : null;
      }).filter(Boolean);
      return strokes.length ? { pageIndex: page.index, strokes: strokes } : null;
    }).filter(Boolean);
    return { lessonId: activity.lessonId, choice: activity.choice, annotations: annotations };
  }

  function reset() {
    activity.choice = '';
    activity.pages.forEach(function (page) {
      page.strokes = [];
      page.currentStroke = null;
      drawPage(page);
    });
    var textarea = document.getElementById('studentAnswer');
    if (textarea) textarea.value = '';
    Array.prototype.forEach.call(document.querySelectorAll('.image-activity-choice'), function (button) {
      button.classList.remove('is-selected');
      button.setAttribute('aria-pressed', 'false');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.teacher-image-activity-toggle'), function (button) {
      button.setAttribute('aria-pressed', 'false');
      button.classList.remove('is-selected');
      button.textContent = '✍️ اكتب على الصورة';
    });
    activity.pages.forEach(function (page) {
      page.active = false;
      page.canvas.style.pointerEvents = 'none';
    });
    clearDraft();
  }

  window.TeacherImageActivity = { init: init, toggle: toggle, undo: undo, clear: clear, choose: choose, getSubmission: getSubmission, reset: reset };
})();
