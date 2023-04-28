import keyBoardFunc from './modules/func.js';

// Set language first time.
if (sessionStorage.getItem('keyboardLang') === undefined) {
  sessionStorage.setItem('keyboardLang', 'en');
}
const textarea = keyBoardFunc.addInputElement();
const keyboard = keyBoardFunc.addKeyboardElement();
const keyboardButtons = keyboard.querySelectorAll('.keyboard__key');
let altPressed;
let ctrlPressed;

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
      button.querySelector(`.key__inner[data-language="${currentLanguage}"]`).classList.toggle('hidden');
    }
  });

  sessionStorage.setItem('keyboardLang', newLanguage);
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
  button.addEventListener('click', function buttonClick() {
    const keyInner = this.querySelector('.key__inner:not(.hidden)');

    if (keyInner) {
      addText(keyInner.getAttribute('data-char'));
    } else if (this.classList.contains('Space')) {
      addText(' ');
    } else if (this.classList.contains('Enter')) {
      addText('\n');
    } else if (this.classList.contains('Tab')) {
      addText('    ');
    } else if (this.classList.contains('Backspace')) {
      removeTextBeforeCaret();
    } else if (this.classList.contains('Delete')) {
      removeTextAfterCaret();
    }
  });
});

/**
 * Listen click event on physical keyboard.
 */
window.addEventListener('keyup', (event) => {
  //capsLockPressed = event.getModifierState('CapsLock');
  //shiftPressed = event.shiftKey;
  altPressed = event.altKey;
  ctrlPressed = event.ctrlKey;

  if ((ctrlPressed && event.key === 'Alt')
  || (altPressed && event.key === 'Control')) {
    changeLanguage();
  }
});
