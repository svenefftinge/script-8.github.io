const getUserInput = keys => {
  const { buttons } = window.navigator.getGamepads()[0] || {}

  return {
    up: keys.has('ArrowUp') || (buttons && buttons[12].pressed),
    right: keys.has('ArrowRight') || (buttons && buttons[15].pressed),
    down: keys.has('ArrowDown') || (buttons && buttons[13].pressed),
    left: keys.has('ArrowLeft') || (buttons && buttons[14].pressed),
    a: keys.has('a') || (buttons && (buttons[1].pressed || buttons[2].pressed)),
    b: keys.has('b') || (buttons && (buttons[0].pressed || buttons[3].pressed)),
    start: keys.has('Enter') || (buttons && buttons[9].pressed),
    select: keys.has(' ') || (buttons && buttons[8].pressed)
  }
}

export default getUserInput
