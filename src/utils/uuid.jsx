const REGEXP = /[xy]/g;
const PATTERN = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

function replacement(c) {
  const r = (Math.random() * 16) | 0; // eslint-disable-line no-bitwise
  // eslint-disable-next-line no-mixed-operators
  const v = c === 'x' ? r : (r & 0x3) | 0x8; // eslint-disable-line no-bitwise
  return v.toString(16);
}

/**
 * Generate a univierally unique identifier
 *
 * @return {String}
 */
export default function uuid() {
  return PATTERN.replace(REGEXP, replacement);
}
