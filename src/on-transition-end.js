const transitions = {};
const eventName = 'transitionend';
let count = 0;

function uniqueId() {
  count += 1;
  return eventName + count;
}

export function cancelTransitionEnd(id) {
  if (transitions[id]) {
    transitions[id].element.removeEventListener(eventName, transitions[id].listener);
    transitions[id] = null;
    return true;
  }

  return false;
}

export function onTransitionEnd(element, callback) {
  const id = uniqueId();
  const listener = (evt) => {
    if (evt.currentTarget === evt.target) {
      cancelTransitionEnd(id);
      callback(evt);
    }
  };

  element.addEventListener(eventName, listener);

  transitions[id] = { element, listener };

  return id;
}
