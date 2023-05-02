import keyBoardFunc from './modules/func.js';

// Set language first time.
if (!sessionStorage.getItem('keyboardLang')) {
  sessionStorage.setItem('keyboardLang', 'en');
}

keyBoardFunc.addDescription();
const textarea = keyBoardFunc.addInputElement();
const keyboard = keyBoardFunc.addKeyboardElement();
const keyboardButtons = keyboard.querySelectorAll('.keyboard__key');
let altPressed;
let ctrlPressed;
let shiftPressed;
let capsLockIsOn = false;
let shiftIsClicked = false;

/**
 * Scroll textarea.
 */
function scrollTextareaToCursor() {
  textarea.blur();
  textarea.focus();
}

/**
 * Add text to textarea.
 * @param {*} text
 */
function addText(text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const { value } = textarea;

  const newValue = `${value.substring(0, start)}${text}${value.substring(end, value.length)}`;

  textarea.value = newValue;
  textarea.selectionStart = start + text.length;
  textarea.selectionEnd = start + text.length;
}

/**
 * Remove text before caret.
 * @param {*} text
 */
function removeTextBeforeCaret() {
  let start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (end !== 0) {
    const { value } = textarea;

    if (start === end) {
      start -= 1;
    }

    const newValue = `${value.substring(0, start)}${value.substring(end, value.length)}`;

    textarea.value = newValue;
    textarea.selectionStart = start;
    textarea.selectionEnd = start;
  }
}

/**
 * Remove text after caret.
 * @param {*} text
 */
function removeTextAfterCaret() {
  const start = textarea.selectionStart;
  let end = textarea.selectionEnd;
  const { value } = textarea;

  if (start !== value.length) {
    if (start === end) {
      end += 1;
    }

    const newValue = `${value.substring(0, start)}${value.substring(end, value.length)}`;

    textarea.value = newValue;
    textarea.selectionStart = start;
    textarea.selectionEnd = start;
  }
}

/**
 * Change keyboard language.
 */
function changeLanguage() {
  const currentLanguage = sessionStorage.getItem('keyboardLang');
  const newLanguage = currentLanguage === 'en' ? 'ru' : 'en';

  keyboardButtons.forEach((button) => {
    if (button.querySelector('.key__inner.hidden')) {
      button.querySelector('.key__inner.hidden').classList.toggle('hidden');

      if (button.querySelector(`.key__inner[data-language="${currentLanguage}"]`)) {
        button.querySelector(`.key__inner[data-language="${currentLanguage}"]`).classList.toggle('hidden');
      }
    }
  });

  sessionStorage.setItem('keyboardLang', newLanguage);
}

/**
 * Move caret according to arrows.
 * @param {*} direction
 */
function moveCaret(direction) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const { value } = textarea;

  switch (direction) {
    case 'left':
      if (start === end && start > 0) {
        textarea.selectionEnd = end - 1;
      } else if (start !== end) {
        textarea.selectionEnd = start;
      }
      break;

    case 'right':
      if (start === end && end < value.length) {
        textarea.selectionStart = start + 1;
      } else if (start !== end) {
        textarea.selectionStart = end;
      }
      break;

    case 'up': {
      const previousLineEnd = value.lastIndexOf('\n', start - 1);
      let newPos = 0;

      if (previousLineEnd !== -1) {
        const currentLineStart = previousLineEnd + 1;
        const currentLinePos = start - currentLineStart;
        const beforePreviousLineEnd = value.lastIndexOf('\n', previousLineEnd - 1);
        const previousLineStart = beforePreviousLineEnd + 1;
        newPos = previousLineStart + currentLinePos;
        newPos = newPos <= previousLineEnd ? newPos : previousLineEnd;
      }

      textarea.setSelectionRange(newPos, newPos);
      break;
    }

    case 'down': {
      const currentLineEnd = value.indexOf('\n', start);
      let newPos = value.length;

      if (currentLineEnd !== -1) {
        const nextLineStart = currentLineEnd + 1;
        const currentLineStart = value.lastIndexOf('\n', start - 1) + 1;
        const currentLinePos = start - currentLineStart;
        newPos = nextLineStart + currentLinePos;
        newPos = newPos <= value.length ? newPos : value.length;
      }

      textarea.setSelectionRange(newPos, newPos);
      break;
    }

    default:
      break;
  }
}

/**
 * Turn on / off button highlight.
 * @param {*} button
 * @param {*} on
 */
function highlightButton(button, on = true) {
  if (on) button.classList.add('keyboard__key_active');
  else button.classList.remove('keyboard__key_active');
}

/**
 * Focus on textarea.
 */
keyboard.addEventListener('click', () => {
  textarea.focus();
});

/**
 * Implement virtual keyboard.
 */
keyboardButtons.forEach((button) => {
  const currentIsCapsLock = button.classList.contains('CapsLock');
  const currentIsShift = button.classList.contains('ShiftLeft') || button.classList.contains('ShiftRight');

  button.addEventListener('click', function buttonClick() {
    const keyInner = this.querySelector('.key__inner:not(.hidden)');
    const shiftIsOn = shiftIsClicked || shiftPressed;
    const toUpperCase = (capsLockIsOn && !shiftIsOn) || (!capsLockIsOn && shiftIsOn);

    if (keyInner) {
      let text = `${keyInner.getAttribute('data-char')}`;

      if (toUpperCase && keyInner.classList.contains('upperCase')) {
        text = text.toUpperCase();
      } else if (shiftIsOn && keyInner.getAttribute('data-shiftkey')) {
        text = keyInner.getAttribute('data-shiftkey');
      }

      addText(text);
    } else if (this.classList.contains('Space')) {
      addText(' ');
    } else if (this.classList.contains('Enter')) {
      addText('\n');
    } else if (this.classList.contains('Tab')) {
      addText('\t');
    } else if (this.classList.contains('Backspace')) {
      removeTextBeforeCaret();
    } else if (this.classList.contains('Delete')) {
      removeTextAfterCaret();
    } else if (this.classList.contains('ArrowLeft')) {
      moveCaret('left');
    } else if (this.classList.contains('ArrowRight')) {
      moveCaret('right');
    } else if (this.classList.contains('ArrowUp')) {
      moveCaret('up');
    } else if (this.classList.contains('ArrowDown')) {
      moveCaret('down');
    }

    scrollTextareaToCursor();
  });

  button.addEventListener('mousedown', () => {
    capsLockIsOn = currentIsCapsLock ? !capsLockIsOn : capsLockIsOn;
    shiftIsClicked = currentIsShift;
    highlightButton(button);
  });

  ['mouseup'].forEach((e) => {
    button.addEventListener(e, () => {
      shiftIsClicked = false;
      if (!currentIsCapsLock) highlightButton(button, false);
      else if (capsLockIsOn) highlightButton(button);
      else highlightButton(button, false);
    });
  });
});

/**
 * Listen keydown event on physical keyboard.
 */
window.addEventListener('keydown', (event) => {
  capsLockIsOn = (event.code === 'CapsLock') ? !capsLockIsOn : capsLockIsOn;
  shiftPressed = event.key === 'Shift' || event.shiftKey;
  altPressed = event.altKey;
  ctrlPressed = event.ctrlKey;
  const modifier = altPressed || ctrlPressed;
  const button = event.code ? document.querySelector(`.keyboard__key.${event.code}`) : null;

  if (button) {
    if (event.code !== 'CapsLock') highlightButton(button);

    if (!modifier && !['Alt', 'Control', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      button.click();
      event.preventDefault();
    }
  }
});

/**
 * Listen keyup event on physical keyboard.
 */
window.addEventListener('keyup', (event) => {
  const button = event.code ? document.querySelector(`.keyboard__key.${event.code}`) : null;
  const currentIsCapsLock = event.code === 'CapsLock';
  shiftPressed = event.key === 'Shift' ? false : event.shiftKey;
  altPressed = event.altKey;
  ctrlPressed = event.ctrlKey;

  if (button) {
    if (!currentIsCapsLock) highlightButton(button, false);
    else if (capsLockIsOn) highlightButton(button);
    else highlightButton(button, false);
  }

  if ((ctrlPressed && event.key === 'Alt')
  || (altPressed && event.key === 'Control')) {
    changeLanguage();
  }
});

/**
 * Listen blur event on window.
 */
window.addEventListener('blur', () => {
  keyboardButtons.forEach((button) => {
    highlightButton(button, false);
  });
});
