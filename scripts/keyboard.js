import keyBoardFunc from './modules/func.js';

const textarea = keyBoardFunc.addInputElement();
const keyboard = keyBoardFunc.addKeyboardElement();
const keyboardButtons = keyboard.querySelectorAll('button');

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
    const keyInner = this.querySelector('span:not(hidden)');

    if (keyInner) {
      addText(keyInner.getAttribute('data-char'));
    } else if (this.classList.contains('Space')) {
      addText(' ');
    } else if (this.classList.contains('Enter')) {
      addText('\n');
    }
  });
});
