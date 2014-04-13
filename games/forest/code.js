 m = Math;
 p = [50, 56, 200];
 s = [0, 30];
 i = 0;
 h = function () {
     var n = 0;
     for (i = 0; i < p.length;) {
         if (p[i] > n) n = p[i];
         i++;
     }
     return n;
 }

 w = function () {
     return (a.width - 30) / p.length;
 }

 v = function (l) {
     var total = 0;
     for (i = 0; i < l.length;) {
         total += l[i];
         i++;
     }
     return (total / l.length);
 }

 function getValues() {
     var xml = loadXMLDoc("stats.xml");
     var pu = xml.getElementsByTagName("time");
     var si = xml.getElementsByTagName("amt");
     for (i = 0; i < pu.length; i++) {
         p[i] = pu[i].childNodes[0].nodeValue;
     }
     for (i = 0; i < si.length; i++) {
         s[i] = si[i].childNodes[0].nodeValue;
     }
 }

 function init() {
     sc = (a.height / h() / 2);
     getValues();
     /** p = [];
     s = [];
     for (i = 0; i < m.ceil(m.random() * 20); i++) {
         p[i] = m.ceil(m.random() * settings.pmax) + 100;
         s[i] = m.floor(m.random() * settings.smax);
     }**/
     loop();
 }

 function loop() {
     c.clearRect(0, 0, b.clientWidth, b.clientHeight);
     with(c) {
         strokeStyle = "#000";
         space = (h() > 100) ? 25 : 10;
         x = h() / space;
         for (i = 0; i < x;) {
             if (i != 0) {
                 moveTo(10, a.height - (sc * (space * i)));
                 lineTo(0, a.height - (sc * (space * i)));
             }
             i++
         }
         stroke();
         fillStyle = "#F00";
         for (i = 0; i < p.length;) {
             fillRect(30 + i * w(), a.height, m.floor(w() / 2), -(p[i] * sc));
             i++;
         }
         fillStyle = "#FF0";
         for (i = 0; i < s.length;) {
             fillRect(30 + i * w(), a.height, m.floor(w() / 2), -(s[i] * sc));
             i++;
         }
     }
     requestAnimationFrame(loop);
 }
 window.onresize(b.clientWidth, b.clientHeight);
 init();
