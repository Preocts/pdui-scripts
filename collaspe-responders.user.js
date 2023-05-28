// ==UserScript==
// @name         collaspe-responders-widget
// @namespace    https://github.com/Preocts
// @version      0.1
// @description  Collaspe the responders widget on incident pages by default, click to expand if needed.
// @author       Preocts
// @match        https://*.pagerduty.com/incidents/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pagerduty.com
// @grant        none
// ==/UserScript==

const widgetCollapsed = false;

function toggleWidgetDisplay(target) {
  const children = target.children;
  // Do not touch the first child, it is the label
  for (let i = 1; i < children.length; i++) {
    children[i].style.display = widgetCollapsed ? 'block' : 'none';
  }
  widgetCollapsed = !widgetCollapsed;
}

(function () {
  'use strict';
  const urlMatch = /https:\/\/.*\.pagerduty\.com\/incidents\/.+/;
  if (!urlMatch.test(window.location.href)) {
    console.debug('[collasp-responders-widget] Not on an incident page');
    return;
  }

  new MutationObserver((_, observer) => {
    const respondersWidget = document.getElementById('respondersWidget');

    if (!respondersWidget) {
      console.debug('[collasp-responders-widget] Responders widget not found');
      return;
    }
    const label = respondersWidget.firstElementChild;

    // add onClick to label for toggling display
    label.addEventListener('click', () => {
      toggleWidgetDisplay(respondersWidget);
    });

    // Click the label to collapse the widget
    label.click();
    console.debug('[collasp-responders-widget] Widget collapsed');

    observer.disconnect();

  }).observe(document.body, { childList: true, subtree: true });
})();
