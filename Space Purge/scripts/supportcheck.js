'use strict';
'use strict';
(function() {
    let isKasperskyScriptInjected = checkKasperskyScript();
    let missingFeatures = checkMissingFeatures();
    let ua = navigator.userAgent.toLowerCase();
    let isIOS = /iphone|ipad|ipod/i.test(ua);
    let isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    if (missingFeatures.length === 0 && !isKasperskyScriptInjected) {
        window["C3_IsSupported"] = true;
    } else {
        displayErrorMessage(isKasperskyScriptInjected, missingFeatures, ua, isIOS, isSafari);
    }

    function checkKasperskyScript() {
        return !!document.querySelector('script[src*="kaspersky"]');
    }

    function checkMissingFeatures() {
        let tmpCanvas = document.createElement("canvas");
        let missingFeatures = [];

        if (!hasWebGL(tmpCanvas)) missingFeatures.push("WebGL");
        if (!hasWebAssembly()) missingFeatures.push("WebAssembly");
        if (!hasJavaScriptModules()) missingFeatures.push("JavaScript Modules");

        return missingFeatures;
    }

    function hasWebGL(canvas) {
        return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    }

    function hasWebAssembly() {
        return typeof WebAssembly !== "undefined";
    }

    function hasJavaScriptModules() {
        return "noModule" in HTMLScriptElement.prototype;
    }

    function displayErrorMessage(isKasperskyScriptInjected, missingFeatures, ua, isIOS, isSafari) {
        let msgWrap = createMessageWrapper();
        let msgTitle = createMessageTitle(isKasperskyScriptInjected);
        let msgBody = createMessageBody(isKasperskyScriptInjected, missingFeatures, ua, isIOS, isSafari);

        msgWrap.appendChild(msgTitle);
        msgWrap.appendChild(msgBody);
        document.body.appendChild(msgWrap);
    }

    function createMessageWrapper() {
        let msgWrap = document.createElement("div");
        msgWrap.id = "notSupportedWrap";
        return msgWrap;
    }

    function createMessageTitle(isKasperskyScriptInjected) {
        let msgTitle = document.createElement("h2");
        msgTitle.id = "notSupportedTitle";
        msgTitle.textContent = isKasperskyScriptInjected
            ? "Kaspersky Internet Security broke this export"
            : "Software update needed";
        return msgTitle;
    }

    function createMessageBody(isKasperskyScriptInjected, missingFeatures, ua, isIOS, isSafari) {
        let msgBody = document.createElement("p");
        msgBody.className = "notSupportedMessage";
        msgBody.innerHTML = generateMessageText(isKasperskyScriptInjected, missingFeatures, ua, isIOS, isSafari);
        return msgBody;
    }

    function generateMessageText(isKasperskyScriptInjected, missingFeatures, ua, isIOS, isSafari) {
        if (isKasperskyScriptInjected) {
            return "It appears a script was added to this export by Kaspersky software. This prevents the exported project from working. Try disabling Kaspersky and exporting again."
        }

        let msgText = "This content is not supported because your device's software is out-of-date. ";
        msgText += getBrowserSpecificMessage(isIOS, isSafari, ua);
        msgText += `<br><br><em>Missing features: ${missingFeatures.join(", ")}<br>User agent: ${navigator.userAgent}</em>`;

        return msgText;
    }

    function getBrowserSpecificMessage(isIOS, isSafari, ua) {
        if (isIOS) {
            return "<br><br>Note: Ensure you are using the latest iOS version and Safari is up-to-date. If using the <strong>iOS simulator</strong>, please use <strong>Xcode 12+</strong>. Testing on a real device is recommended.";
        } else if (isSafari) {
            return "<br><br><strong>Safari may have compatibility issues</strong>. Try using a different browser such as <a href='https://www.google.com/chrome'>Chrome</a> or <a href='https://www.mozilla.org/firefox'>Firefox</a>.";
        } else if (/msie|trident/i.test(ua) || /edge\//i.test(ua)) {
            return "<br><br>Note: <strong>Internet Explorer</strong> and the <strong>legacy Edge browser</strong> are not supported. Please try using <a href='https://www.google.com/chrome'>Chrome</a> or <a href='https://www.mozilla.org/firefox'>Firefox</a>.";
        } else {
            return "Please install any available software updates or try on a different device or browser.";
        }
    }

})();

