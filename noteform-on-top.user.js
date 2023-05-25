// ==UserScript==
// @name         noteform-on-top
// @namespace    https://github.com/Preocts
// @version      0.1
// @description  Flip the note box on PagerDuty to the top of the list of current notes
// @author       Preocts
// @match        https://*.pagerduty.com/incidents/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pagerduty.com
// @grant        none
// ==/UserScript==

const urlMatch = /https:\/\/.*\.pagerduty\.com\/incidents\/.+/;
const elementName = 'Note form';

(function () {
  'use strict';
  if (!urlMatch.test(window.location.href)) {
    console.debug('[noteform-on-top] Not on an incident page');
    return;
  }

  new MutationObserver((_, observer) => {
    const noteForm = document.getElementsByName(elementName);
    if (!noteForm || noteForm.length === 0) {
      console.debug('[noteform-on-top] Note form not found')
      return;
    }
    const noteWidget = noteForm[0].parentNode;
    // If the widget is not the first child, move it to the top
    if (noteWidget && noteForm[0].previousElementSibling) {
      console.debug('[noteform-on-top] Moving note form to top of widget');
      noteWidget.insertBefore(noteForm[0], noteWidget.firstChild);
      observer.disconnect();
    };
  }).observe(document.body, { childList: true, subtree: true });
})();
