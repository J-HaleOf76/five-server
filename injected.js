// <![CDATA[  <-- For SVG support
if ("WebSocket" in window) {
  (function () {
    function refreshCSS() {
      var sheets = [].slice.call(document.getElementsByTagName("link"));
      var head = document.getElementsByTagName("head")[0];
      for (var i = 0; i < sheets.length; ++i) {
        var elem = sheets[i];
        head.removeChild(elem);
        var rel = elem.rel;
        if ((elem.href && typeof rel != "string") || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
          var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, "");
          elem.href = url + (url.indexOf("?") >= 0 ? "&" : "?") + "_cacheOverride=" + new Date().valueOf();
        }
        head.appendChild(elem);
      }
    }
    function injectBody(body) {
      document.body.innerHTML = body;
    }
    var protocol = window.location.protocol === "http:" ? "ws://" : "wss://";
    var address = protocol + window.location.host + window.location.pathname + "/ws";
    var socket = new WebSocket(address);
    socket.onmessage = function (msg) {
      if (msg.data == "reload") window.location.reload();
      else if (msg.data == "refreshcss") refreshCSS();
      else injectBody(msg.data);
    };
    socket.onopen = function () {
      var scripts = document.querySelectorAll("script");
      for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if (script.dataset && script.dataset.file) {
          socket.send(JSON.stringify({ file: script.dataset.file }));
        }
      }

      console.log(
        `%c %c %c %c %c Five-Server is connected. %c https://npmjs.com/five-server`,
        "background: #ff0000",
        "background: #ffff00",
        "background: #00ff00",
        "background: #00ffff",
        "color: #fff; background: #000000;",
        "background: none",
      );
    };
  })();
}
// ]]>
