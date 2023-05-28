// ==UserScript==
// @name         collaspable-widgets
// @namespace    https://github.com/Preocts
// @version      0.3
// @description  Gives all right-hand widgets a collapse/expand button. Default view is expanded.
// @author       Preocts
// @match        https://*.pagerduty.com/incidents/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pagerduty.com
// @grant        none
// ==/UserScript==

const allowedLabels = [
  'Responders',
  'Notes',
];

function toggleWidgetDisplay(target) {
  const children = target.children;
  const isHidden = children[1].style.display === 'none';

  // Do not hide the first child, it is the label
  for (let i = 1; i < children.length; i++) {
    children[i].style.display = isHidden ? null : 'none';
  }

  // Toggle the label text
  var labelText = target.firstElementChild.innerText;
  labelText = isHidden ? labelText.replace('▶', '▼') : labelText.replace('▼', '▶');
  labelText = isHidden ? labelText.replace('expand', 'collapse') : labelText.replace('collapse', 'expand');
  target.firstElementChild.innerText = labelText;
}

function isAllowed(target) {
  // Checks if the target widget is allowed to be collapsed
  // NOTE: Requires the first child to be the label and the label text is in the allowedLabels array
  const label = target.firstElementChild;
  return (!label || !allowedLabels.includes(label.innerText)) ? false : true;
}

function addStyle(target) {
  // Adds pointer style and label text to the taget widget
  // NOTE: Assumes the first child is the label
  const label = target.firstElementChild;
  if (!label || !allowedLabels.includes(label.innerText)) {
    return false;
  }
  label.style.cursor = 'pointer';
  label.innerText = '▼ ' + label.innerText + ' (click to collapse)';
  return true;
}

function addOnClick(target) {
  // Adds onClick to the target widget's label
  // NOTE: Assumes the first child is the label
  const label = target.firstElementChild;
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
    // Cue off the responders widget which is removed on resolved incidents
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
      if (!isAllowed(columnChildren[idx])) {
        continue;
      }
      addStyle(columnChildren[idx]);
      addOnClick(columnChildren[idx]);
    };

    observer.disconnect();

  }).observe(document.body, { childList: true, subtree: true });
})();
