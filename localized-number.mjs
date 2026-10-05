const NUMBER_SELECTOR = 'input[type="number"], input[data-localized-number]';

export function decimalSeparator(locale = 'en-US') {
  return new Intl.NumberFormat(locale).formatToParts(1.1)
    .find(part => part.type === 'decimal')?.value ?? '.';
}

export function normalizeLocalizedNumberText(value, locale = 'en-US', { finalize = false } = {}) {
  const separator = decimalSeparator(locale);
  const source = String(value ?? '').trim();
  let result = '';
  let hasSeparator = false;
  for (const character of source) {
    if (/\d/.test(character)) result += character;
    else if ((character === '-' || character === '+') && !result) result += character;
    else if ((character === '.' || character === ',') && !hasSeparator) {
      result += separator;
      hasSeparator = true;
    }
  }
  if (!finalize) return result;
  if (result === '-' || result === '+' || result === separator) return '';
  if (result.startsWith(separator)) result = `0${result}`;
  if (result.startsWith(`-${separator}`) || result.startsWith(`+${separator}`)) result = `${result[0]}0${result.slice(1)}`;
  if (result.endsWith(separator)) result = result.slice(0, -separator.length);
  return result;
}

export function canonicalNumberText(value) {
  return normalizeLocalizedNumberText(value, 'en-US', { finalize: true }).replace(',', '.');
}

function setLocalizedValue(input, locale, finalize = false) {
  const start = input.selectionStart;
  const next = normalizeLocalizedNumberText(input.value, locale, { finalize });
  if (next === input.value) return false;
  input.value = next;
  if (start != null && document.activeElement === input) {
    const position = Math.min(start, next.length);
    input.setSelectionRange(position, position);
  }
  return true;
}

function prepareInput(input, locale) {
  if (!(input instanceof HTMLInputElement) || !input.matches(NUMBER_SELECTOR)) return;
  if (!input.dataset.localizedNumber) {
    input.dataset.localizedNumber = 'true';
    if (input.type === 'number') input.type = 'text';
    input.inputMode = 'decimal';
    input.autocomplete = 'off';
    input.spellcheck = false;
  }
  setLocalizedValue(input, locale);
}

export function refreshLocalizedNumberInputs(root = document, getLocale = () => document.documentElement.lang || 'en-US') {
  const locale = typeof getLocale === 'function' ? getLocale() : getLocale;
  if (root instanceof HTMLInputElement) prepareInput(root, locale);
  root.querySelectorAll?.(NUMBER_SELECTOR).forEach(input => prepareInput(input, locale));
}

export function installLocalizedNumberInputs(root = document, getLocale = () => document.documentElement.lang || 'en-US') {
  const locale = () => typeof getLocale === 'function' ? getLocale() : getLocale;
  refreshLocalizedNumberInputs(root, locale);

  root.addEventListener('input', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.dataset.localizedNumber !== 'true') return;
    setLocalizedValue(input, locale());
  }, true);

  root.addEventListener('blur', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.dataset.localizedNumber !== 'true') return;
    if (setLocalizedValue(input, locale(), true)) input.dispatchEvent(new Event('input', { bubbles: true }));
  }, true);

  root.addEventListener('keydown', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.dataset.localizedNumber !== 'true' || event.code !== 'NumpadDecimal') return;
    event.preventDefault();
    const separator = decimalSeparator(locale());
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    input.setRangeText(separator, start, end, 'end');
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: separator }));
  }, true);

  const observer = new MutationObserver(records => {
    for (const record of records) for (const node of record.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) refreshLocalizedNumberInputs(node, locale);
    }
  });
  observer.observe(root, { subtree: true, childList: true });
  return observer;
}
