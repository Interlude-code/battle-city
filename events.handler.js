function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function updateKeys(key, isKeyDown, tank) {
  tank.keysState[key] = isKeyDown;
  tank.keyPressed = isKeyDown ? key : null;
}

function keyUpHandler(event, tank) {
  const { key } = event;
  updateKeys(key, false, tank);
}

function keyDownHandler(event, tank) {
  const { key } = event;
  updateKeys(key, true, tank);
}
function initEvents(tank) {

  return new Promise((resolve) => {
    resolve()
  }).then(() => {
    document.addEventListener('keydown', (event) => keyDownHandler(event, tank));
    document.addEventListener('keyup', (event) => keyUpHandler(event, tank));
  })

}

export default initEvents