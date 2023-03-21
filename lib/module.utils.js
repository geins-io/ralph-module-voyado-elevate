const logSyle =
  'background: #03BA78;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em;';
const moduleOptions = '<%= JSON.stringify(options) %>';
export function log(...args) {
  const options = JSON.parse(moduleOptions);
  // eslint-disable-next-line no-console
  console.log('%c' + options.name, logSyle, ...args);
}
