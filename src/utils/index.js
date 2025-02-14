const snakeToCamelCase = (obj) => {
  let newObj;

  if (Array.isArray(obj)) {
    newObj = obj.map(snakeToCamelCase);
  } else if (typeof obj === 'object' && obj !== null) {
    const camelCasedObj = {};
    Object.keys(obj).forEach((keyString) => {
      const camelCasedKey = keyString.replace(/([-_][a-zA-Z])/g, (group) => group.slice(-1).toUpperCase());
      camelCasedObj[camelCasedKey] = snakeToCamelCase(obj[keyString]);
    });
    newObj = camelCasedObj;
  } else {
    newObj = obj;
  }
  return newObj;
};

const camelToSnakeCase = (obj) => {
  let newObj;

  if (Array.isArray(obj)) {
    newObj = obj.map(camelToSnakeCase);
  } else if (typeof obj === 'object' && obj !== null) {
    const snakeCasedObj = {};
    Object.keys(obj).forEach((keyString) => {
      const snakeCasedKey = keyString.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      snakeCasedObj[snakeCasedKey] = camelToSnakeCase(obj[keyString]);
    });
    newObj = snakeCasedObj;
  } else {
    newObj = obj;
  }
  return newObj;
};

const splitKeyAndValue = (data = {}) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const orders = keys.map((key, index) => ({ key, seq: index + 1 }));
  return { keys, values, orders };
};

module.exports = { snakeToCamelCase, camelToSnakeCase, splitKeyAndValue };
