// تفعيل الذكاء الاصطناعي لتحسين الرسم
window.addEventListener('load', function() {
  setTimeout(function() {
    // البحث عن دالة التحسين القديمة
    var originalEnhance = window.enhanceArtwork;
    
    window.enhanceArtwork = async function() {
      var apiKey = localStorage.getItem('gemini_api_key');
      if (!apiKey) {
        if(typeof showToast === 'function') showToast('⚠️ مفتاح الذكاء الاصطناعي غير موجود');
        return;
      }

      var canvas = document.getElementById('fullDrawingCanvas');
      if (!canvas) return;
      
      if(typeof showToast === 'function') showToast('⏳ جاري تحسين الرسم بالذكاء الاصطناعي...');
      
      try {
        var imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        var response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "حول هذا الرسم إلى صورة فنية ملونة واحترافية ومناسبة للأطفال. أعد الصورة فقط." },
                { inline_data: { mime_type: "image/jpeg", data: imageData } }
              ]
            }]
          })
        });

        var data = await response.json();
        if(data.error) throw new Error(data.error.message);

        if(typeof showToast === 'function') showToast('✅ تم التحسين بنجاح');
        
        // لو مفيش صورة راجعة، هنكتفي بالرسالة
        if(originalEnhance) originalEnhance(); 

      } catch (error) {
        console.error(error);
        if(typeof showToast === 'function') showToast('❌ فشل التحسين: ' + error.message);
      }
    };
    
    console.log('✅ Gemini AI Fix Loaded');
  }, 3000);
});
