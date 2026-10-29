// درس حرف الألف - الصف الأول الابتدائي
window.addEventListener('load', function() {
  setTimeout(function() {
    window.openLessonAlef = function() {
      var m = document.createElement('div');
      m.id = 'alefLessonModal';
      m.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#E1F5FE,#B3E5FC);z-index:99999;overflow-y:auto;padding:20px;font-family:inherit;direction:rtl;';
      
      var h = '<div style="max-width:500px;margin:0 auto;background:#fff;border-radius:20px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,.2);">';
      h += '<div style="text-align:center;margin-bottom:20px;">';
      h += '<div style="font-size:100px;font-weight:bold;color:#E65100;cursor:pointer;" onclick="speakText(\'أ\')">أ</div>';
      h += '<div style="font-size:20px;color:#2E7D32;font-weight:bold;">حرف الألف</div>';
      h += '</div>';
      
      h += '<div style="background:#FFF8E1;border-radius:14px;padding:16px;margin-bottom:16px;">';
      h += '<div style="font-size:16px;line-height:2;color:#424242;">';
      h += 'الألف هو أول حرف في اللغة العربية. الألف مثل العصا الطويلة. كلمات تبدأ بالألف: ';
      h += '<span onclick="speakText(\'أسد\')" style="color:#E65100;font-weight:bold;cursor:pointer;text-decoration:underline;">أَسَد</span>، ';
      h += '<span onclick="speakText(\'أرنب\')" style="color:#E65100;font-weight:bold;cursor:pointer;text-decoration:underline;">أَرْنَب</span>، ';
      h += '<span onclick="speakText(\'أذن\')" style="color:#E65100;font-weight:bold;cursor:pointer;text-decoration:underline;">أُذُن</span>.';
      h += '</div></div>';
      
      h += '<div style="text-align:center;margin-bottom:16px;">';
      h += '<div style="font-size:60px;cursor:pointer;" onclick="speakText(\'أسد\')">🦁</div>';
      h += '<div style="font-size:18px;color:#2E7D32;font-weight:bold;">أَسَد</div>';
      h += '</div>';
      
      h += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;padding:14px;background:#E65100;color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:16px;font-weight:bold;cursor:pointer;">✕ إغلاق الدرس</button>';
      h += '</div>';
      
      m.innerHTML = h;
      document.body.appendChild(m);
      
      if(typeof speakText === 'function') speakText('حرف الألف');
    };
    
    console.log('✅ درس حرف الألف جاهز');
  }, 2000);
});
