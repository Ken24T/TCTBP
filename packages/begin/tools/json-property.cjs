'use strict';
// Change one reviewed JSON property without reformatting unrelated project policy.
function span(text, key) {
  let i = 1;
  const whitespace = () => { while (/\s/.test(text[i] || '') && i < text.length) i++; };
  function stringEnd() { i++; while (i < text.length) { if (text[i] === '\\') i += 2; else if (text[i++] === '"') return; } }
  while (i < text.length) {
    whitespace(); if (text[i] === '}') return null;
    const nameStart = i; stringEnd(); const name = JSON.parse(text.slice(nameStart, i));
    whitespace(); if (text[i++] !== ':') throw new Error('Invalid object property.'); whitespace();
    const start = i; let nesting = 0;
    for (; i < text.length; i++) {
      if (text[i] === '"') { stringEnd(); i--; }
      else if (text[i] === '{' || text[i] === '[') nesting++;
      else if ((text[i] === '}' || text[i] === ']') && nesting) nesting--;
      else if (!nesting && (text[i] === ',' || text[i] === '}')) break;
    }
    let end = i; while (/\s/.test(text[end - 1])) end--;
    if (name === key) return { start, end };
    if (text[i] === ',') i++; else return null;
  }
  return null;
}
function update(text, keys, value, depth = 0) {
  const location = span(text, keys[0]);
  if (keys.length > 1) {
    if (!location) throw new Error('Missing parent policy object.');
    return text.slice(0, location.start) + update(text.slice(location.start, location.end), keys.slice(1), value, depth + 1) + text.slice(location.end);
  }
  const formatted = JSON.stringify(value, null, 2).split('\n').map((line, i) => i ? '  '.repeat(depth + 1) + line : line).join('\n');
  if (location) return text.slice(0, location.start) + formatted + text.slice(location.end);
  const end = text.lastIndexOf('}'), before = text.slice(0, end).trimEnd();
  const separator = Object.keys(JSON.parse(text)).length ? ',' : '';
  return `${before}${separator}\n${'  '.repeat(depth + 1)}${JSON.stringify(keys[0])}: ${formatted}\n${'  '.repeat(depth)}}${text.slice(end + 1)}`;
}
module.exports = { update };
