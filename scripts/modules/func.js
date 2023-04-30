import { keys, keyboardRows } from './keys.js';

export default {
  keyboardLang: sessionStorage.getItem('keyboardLang') || 'en',
  container: (() => {
    const container = document.createElement('div');
    container.classList.add('container');
    document.querySelector('body').append(container);

    return container;
  })(),

  /**
   * Add inputElement (textarea).
   * @returns inputElement
   */
  addInputElement() {
    const inputElement = document.createElement('textarea');
    inputElement.classList = 'textarea';
    inputElement.setAttribute('rows', 7);
    this.container.append(inputElement);

    return inputElement;
  },

  /**
   * Add keyboardElement.
   * @returns keyboardElement
   */
  addKeyboardElement() {
    const keyboardElement = document.createElement('div');
    keyboardElement.classList = 'keyboard';
    this.container.append(keyboardElement);

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

  /**
   * Add description block.
   */
  addDescription() {
    const description = document.createElement('div');
    const descriptionHeader = document.createElement('h1');
    const descriptionText = document.createElement('div');

    description.classList.add('description');
    descriptionHeader.classList.add('description__header');
    descriptionHeader.innerHTML = 'Virtual Keyboard';
    descriptionText.classList.add('description__text');
    descriptionText.innerHTML = '<p>Press <span class="shortcut">Ctrl + Alt</span> to switch language.</p>';
    descriptionText.innerHTML += '<p>This keyboard is created via Fedora OS.</p>';

    description.append(descriptionHeader);
    description.append(descriptionText);
    this.container.append(description);
  },
};
