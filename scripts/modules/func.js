import { keys, keyboardRows } from './keys.js';

export default {
  body: document.querySelector('body'),
  keyboardLang: sessionStorage.getItem('keyboardLang') || 'en',

  /**
   * Add inputElement (textarea).
   * @returns inputElement
   */
  addInputElement() {
    const inputElement = document.createElement('textarea');
    inputElement.classList = 'textarea';
    inputElement.setAttribute('rows', 5);
    this.body.append(inputElement);

    return inputElement;
  },

  /**
   * Add keyboardElement.
   * @returns keyboardElement
   */
  addKeyboardElement() {
    const keyboardElement = document.createElement('div');
    keyboardElement.classList = 'keyboard';
    this.body.append(keyboardElement);

    this.addKeys(keyboardElement);

    return keyboardElement;
  },

  /**
   * Add each key to the keyboard.
   * @param {*} keyboardElement
   */
  addKeys(keyboardElement) {
    keyboardRows.forEach((row, index) => {
      const rowElement = document.createElement('div');
      rowElement.classList = `keyboard__row keyboard__row_${index}`;

      row.forEach((key) => {
        const keyObj = keys[key];

        if (keyObj) {
          const keyButton = document.createElement('button');
          keyButton.classList = `keyboard__key key key-${key.toLowerCase()} ${key}`;

          ['und', 'en', 'ru'].forEach((lang) => {
            if (keyObj[lang]) {
              const keyInner = document.createElement('span');
              const keyChar = keyObj[lang].char;
              keyInner.innerText = keyChar;
              keyInner.classList = 'key__inner';
              keyInner.setAttribute('data-char', keyChar);
              keyInner.setAttribute('data-language', lang);

              if (keyObj[lang].shiftKey !== 'upperCase') {
                keyInner.setAttribute('data-shiftKey', keyObj[lang].shiftKey);
                keyInner.classList.add('key__inner_special');
              } else {
                keyInner.classList.add('upperCase');
              }

              if (lang !== 'und' && lang !== this.keyboardLang) {
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
  },
};
