// ==UserScript==
// @name         notewidget-on-top
// @namespace    https://github.com/Preocts
// @version      0.2
// @description  Flip the note widget on PagerDuty incident page to be above the Responders widget
// @author       Preocts
// @match        https://*.pagerduty.com/incidents/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pagerduty.com
// @grant        none
// ==/UserScript==

const urlMatch = /https:\/\/.*\.pagerduty\.com\/incidents\/.+/;
const elementId = 'notesWidget';

(function () {
  'use strict';
  if (!urlMatch.test(window.location.href)) {
    console.debug('[notewidget-on-top] Not on an incident page');
    return;
  }

  new MutationObserver((_, observer) => {
    const noteWidget = document.getElementById(elementId);
    if (!noteWidget) {
      console.debug('[notewidget-on-top] noteWidget element not found')
      return;
    }
    const sideColumn = noteWidget.parentNode;
    // If the widget is not the first child, move it to the top
    if (sideColumn && noteWidget.previousElementSibling) {
      console.debug('[notewidget-on-top] Moving noteWidget to top of sidebar');
      sideColumn.insertBefore(noteWidget, sideColumn.firstChild);
      observer.disconnect();
    };
  }).observe(document.body, { childList: true, subtree: true });
})();
