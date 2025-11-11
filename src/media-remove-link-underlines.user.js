// ==UserScript==
// @name         Remove Link Underline
// @description  Remove link underlines on all sites，and handle new links dynamically.
// @namespace    ChinaGodMan/UserScripts
// @version      1.2.0.63
// @author       dany
// @match        *://*/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADq0lEQVR4nO3Yz6uUVRgH8BOGIbQo3aXgwjvPma6K7loYtNCMoP6BwE1EmxCklZs0olVttETonu9YGi0acJ4zFNaqW8vuIjcurIXRpkS0XxKSohPnXjcZVJx5H9/vO/N84CxmM+/3e87784TgnHPOOeecc84551xDEPOkZoQ5yWOOrTDI8phjKwyyPObYCoMsjzm2wiDLY46tMMjymGMrDLI85tgKgyyPObbCIMtjjq0wyPKYYysMsjzm2AqDLI85tsIgy2OOrTDI8phjKwyyPObYCoMsjzm2wiDLY46tMMjymGMrDLI85tgKgyyPObbCIMtjjq0wyPKYYysMsjzm2AqDLI85tsIgy2OOrTDI8phjKwyyPObYCoMsjzm2wiDLY46tMMjymGMrDLI85tgKgyyPObbCIMtjjq0wyPKYYysMsjzm2AqDLI85tsIgy2MuRb1TU3gSJg80naX8Z02W0iF0VYp6o6b0yZ2fPtp0lhOLw4crF+BG6Kok+WpN6aX+SJrOgpgfq7oFSb4WugqSv61agKjPNJ1lqae7654Beil0FaJ+VnXZi77VfJb8Yl2W/GXoqiT5nbrLXi80nQUxn6x7BuQzoatS1BfqLvtcngPPNZVjuGW4ofZ5NBA9FLrqg94nm2sXADGfHy4O1zeRI/X15docAxk9GboMUVeqF0H01LTHT4vjhRT1t8oMvzZ1ErQGUQ9OcRVMkuS3h2G4rubY5XU2iV6sPwHyR6Hr3t+qj6SYf5luEfSL8hr5f49Zztok+lI5g6c5LkT3hlmQor4+1UTEtS0BSP58SfIrS4+Pt5cH69+OsTjcOOjlfRB9E6I/NHC8b8KsKNsASfL3004K/nmG/lG+VCF6q/H/7o/2h1mS+uOnazfncJ9HivnjMIuS6GttTy7+c+il0/3RpjCLVreERU/RnvmSr5bnS5hlZRGS6DHC286VQe/srjAP1q6E/Cok32x74u+O8+WDLcybJOM9tVvWDY3bEH333lfauXJ84dxDSfKRJPr7fZ78rwe9/ETb/Wmc7o82IeY3IHrZ7j6/+jG3PJDRs233pXX0qeUHU9Tnyz58Ev2pkdtM1JXyNf7ewmhb2/2697Dun90B0QNlUy6Jjld3VyX/CNGfk+Q/VydZ8vW13/pdivoVon6YJB8uZ/rMvtM755xz/4bgC3fSxOjsKrc9cfAFaH/y4FdA+xMIvwV1e4Suanvi4AvQ/uTBr4D2JxDzegtyzjnnnHPOOeecc4HFXxVE+hgKTI5DAAAAAElFTkSuQmCC
// @run-at       document-body
// ==/UserScript==

(function () {
  "use strict";

  var style = document.createElement("style");

  style.innerHTML = /*css*/`a { text-decoration: none !important; }`;

  document.head.appendChild(style);
})();
