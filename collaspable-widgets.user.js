// ==UserScript==
// @name         collaspable-widgets
// @namespace    https://github.com/Preocts
// @version      0.1
// @description  Gives all right-hand widgets a collapse/expand button. Default view is expanded.
// @author       Preocts
// @match        https://*.pagerduty.com/incidents/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pagerduty.com
// @grant        none
// ==/UserScript==

function toggleWidgetDisplay(target) {
  const children = target.children;
  const isHidden = children[1].style.display === 'none';

  // Do not hide the first child, it is the label
  for (let i = 1; i < children.length; i++) {
    children[i].style.display = isHidden ? 'block' : 'none';
  }

  // Update the label text
  var labelText = target.firstElementChild.innerText;
  labelText = isHidden ? labelText.replace('▶', '▼') : labelText.replace('▼', '▶');
  labelText = isHidden ? labelText.replace('expand', 'collapse') : labelText.replace('collapse', 'expand');
  target.firstElementChild.innerText = labelText;
}

function addStyle(target) {
  // Adds pointer style and label text to the taget widget
  // NOTE: Assumes the first child is the label
  const label = target.firstElementChild;
  if (!label) {
    console.debug('[collasp-responders-widget] No label found');
    return;
  }
  label.style.cursor = 'pointer';
  label.innerText = '▼ ' + label.innerText + ' (click to collapse)';
}

function addOnClick(target) {
  // Adds onClick to the target widget's label
  // NOTE: Assumes the first child is the label
  const label = target.firstElementChild;
  if (!label) {
    console.debug('[collasp-responders-widget] No label found');
    return;
  }
  label.addEventListener('click', () => {
    toggleWidgetDisplay(target);
  });
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

    const rightColumn = respondersWidget.parentElement;
    const columnChildren = rightColumn.children;

    if (!columnChildren) {
      console.debug('[collasp-responders-widget] No children found');
      return;
    }

    // Update the sytle of each widget and add onClick
    for (let idx = 0; idx < columnChildren.length; idx++) {
      addStyle(columnChildren[idx]);
      addOnClick(columnChildren[idx]);
    };

    observer.disconnect();

  }).observe(document.body, { childList: true, subtree: true });
})();
