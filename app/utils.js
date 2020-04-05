export const omit = (keys, obj) =>
  Object.entries(obj)
    .filter(([ key ]) => !keys.includes(key))
    .reduce((acc, [key, value]) => Object.assign({}, acc, {
      [key]: value,
    }), {});

export const printConsoleLog = ({ print, onError }) => ({ log, prefix = '<<<' }) => {
  try {
    print(`${prefix} ${log}`);
  } catch (e) {
    onError && onError(e);
  }
};