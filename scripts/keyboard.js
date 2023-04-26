import keys from './modules/keys.js';

const keyboardLang = window.keyboardLang || 'en';
const keyboardRows = [
  [
    'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4',
    'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9',
    'Digit0', 'Minus', 'Equal', 'Backspace',
  ],
  [
    'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR',
    'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO',
    'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete',
  ],
  [
    'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF',
    'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL',
    'Semicolon', 'Quote', 'Enter',
  ],
  [
    'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV',
    'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period',
    'Slash', 'ArrowUp', 'ShiftRight',
  ],
  [
    'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight',
    'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
  ],
];
const body = document.querySelector('body');

const inputElement = document.createElement('textarea');
inputElement.classList = 'textarea';
inputElement.setAttribute('rows', 5);
body.append(inputElement);

const keyboardElement = document.createElement('div');
keyboardElement.classList = 'keyboard';
body.append(keyboardElement);

keyboardRows.forEach((row, index) => {
  const rowElement = document.createElement('div');
  rowElement.classList = `keyboard__row keyboard__row_${index}`;

  row.forEach((key) => {
    const keyObj = keys[key];

    if (keyObj) {
      const keyButton = document.createElement('button');
      keyButton.classList = `keyboard__key key-${key.toLowerCase()} ${key}`;

      ['und', 'en', 'ru'].forEach((lang) => {
        if (keyObj[lang]) {
          const keyInner = document.createElement('span');
          keyInner.innerText = keyObj[lang].char;
          keyInner.setAttribute('data-language', lang);
          keyInner.setAttribute('data-shiftKey', keyObj[lang].shiftKey);

          if (lang !== 'und' && lang !== keyboardLang) {
            keyInner.classList.add('hidden');
          }

          keyButton.append(keyInner);
        }
      });

      rowElement.append(keyButton);
    }
  });

  keyboardElement.append(rowElement);
});
