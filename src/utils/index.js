const snakeToCamelCase = (json) => {
  const camelCasedJson = {};
  Object.keys(json).forEach((keyString) => {
    const camelCasedKey = keyString.toLowerCase().replace(/([-_][a-z])/g, (group) => group.slice(-1).toUpperCase());

    if (typeof json[keyString] === 'object') {
      camelCasedJson[camelCasedKey] = snakeToCamelCase(json[keyString]);
    } else {
      camelCasedJson[camelCasedKey] = json[keyString];
    }
  });

  return camelCasedJson;
};

const camelToSnakeCase = (json) => {
  const snakeCasedJson = {};
  Object.keys(json).forEach((keyString) => {
    const snakeCasedKey = keyString.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

    if (typeof json[keyString] === 'object') {
      snakeCasedJson[snakeCasedKey] = camelToSnakeCase(json[keyString]);
    } else {
      snakeCasedJson[snakeCasedKey] = json[keyString];
    }
  });

  return snakeCasedJson;
};

const splitKeyAndValue = (data = {}) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const orders = keys.map((key, index) => ({ key, seq: index + 1 }));
  return { keys, values, orders };
};

module.exports = { snakeToCamelCase, camelToSnakeCase, splitKeyAndValue };
