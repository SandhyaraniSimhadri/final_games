'use strict';

(function() {
    let pass = true;

    // Example with a variable that could be nullish
    let testValue;  // This is `undefined` initially
    if ((testValue ?? 2) !== 2) pass = false;

    // Conditionally assign if pass is true
    if (pass) {
        window["C3_ModernJSSupport_OK"] = true;
    }
})();
