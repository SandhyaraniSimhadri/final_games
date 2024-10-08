'use strict';
(function() {
    // Check if Kaspersky script is injected
    var isKasperskyScriptInjected = !!document.querySelector('script[src*="kaspersky"]');

    // Create a temporary canvas element to check WebGL support
    var tmpCanvas = document.createElement("canvas");
    var hasWebGL = !!(tmpCanvas.getContext("webgl") || tmpCanvas.getContext("experimental-webgl"));

    // Check for WebAssembly support
    var hasWebAssembly = typeof WebAssembly !== "undefined";

    // Check for JavaScript Modules support
    var hasJavaScriptModules = "noModule" in HTMLScriptElement.prototype;

    // Array to hold missing features
    var missingFeatures = [];
    if (!hasWebGL) missingFeatures.push("WebGL");
    if (!hasWebAssembly) missingFeatures.push("WebAssembly");
    if (!hasJavaScriptModules) missingFeatures.push("JavaScript Modules");

    // Check for Safari or iOS-specific issues
    var ua = navigator.userAgent.toLowerCase();
    var isIOS = /iphone|ipad|ipod/i.test(ua);
    var isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    // If all features are supported and no Kaspersky interference
    if (missingFeatures.length === 0 && !isKasperskyScriptInjected) {
        window["C3_IsSupported"] = true;
    } else {
        // Create and display error message
        var msgWrap = document.createElement("div");
        msgWrap.id = "notSupportedWrap";
        document.body.appendChild(msgWrap);

        var msgTitle = document.createElement("h2");
        msgTitle.id = "notSupportedTitle";

        if (isKasperskyScriptInjected) {
            msgTitle.textContent = "Kaspersky Internet Security broke this export";
        } else {
            msgTitle.textContent = "Software update needed";
        }
        msgWrap.appendChild(msgTitle);

        var msgBody = document.createElement("p");
        msgBody.className = "notSupportedMessage";

        var msgText = "This content is not supported because your device's software is out-of-date. ";

        if (isIOS) {
            msgText += "<br><br>Note: Ensure you are using the latest iOS version and Safari is up-to-date.";
            msgText += " If using the <strong>iOS simulator</strong>, please use <strong>Xcode 12+</strong>. Testing on a real device is recommended.";
        } else if (isSafari) {
            msgText += "<br><br><strong>Safari may have compatibility issues</strong>. Try using a different browser such as <a href='https://www.google.com/chrome'>Chrome</a> or <a href='https://www.mozilla.org/firefox'>Firefox</a>.";
        } else if (/msie|trident/i.test(ua) || /edge\//i.test(ua)) {
            msgText += "<br><br>Note: <strong>Internet Explorer</strong> and the <strong>legacy Edge browser</strong> are not supported. Please try using <a href='https://www.google.com/chrome'>Chrome</a> or <a href='https://www.mozilla.org/firefox'>Firefox</a>.";
        } else if (isKasperskyScriptInjected) {
            msgText = "It appears a script was added to this export by Kaspersky software. This prevents the exported project from working. Try disabling Kaspersky and exporting again.";
        } else {
            msgText += "Please install any available software updates or try on a different device or browser.";
        }

        msgText += "<br><br><em>Missing features: " + missingFeatures.join(", ") + "<br>User agent: " + navigator.userAgent + "</em>";
        msgBody.innerHTML = msgText;
        msgWrap.appendChild(msgBody);
    }
})();
