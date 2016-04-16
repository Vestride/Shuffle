'use strict';

let transitions = {};
let eventName = 'transitionend';
let count = 0;

function uniqueId() {
  return eventName + count++;
}

export function onTransitionEnd(element, callback) {
  let id = uniqueId();
  let listener = (evt) => {
    if (evt.currentTarget === evt.target) {
      cancelTransitionEnd(id);
      callback(evt);
    }
  };

  element.addEventListener(eventName, listener);

  transitions[id] = { element, listener };

  return id;
}

export function cancelTransitionEnd(id) {
  if (transitions[id]) {
    transitions[id].element.removeEventListener(eventName, transitions[id].listener);
    transitions[id] = null;
    return true;
  }

  return false;
}
