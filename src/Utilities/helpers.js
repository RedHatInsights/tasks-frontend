export const uniq = (collection) => [...new Set(collection)];

const getSortable = (property, item) => {
  if (typeof property === 'function') {
    return property(item);
  } else {
    return item[property];
  }
};

export const orderArrayByProp = (property, objects, direction) =>
  objects.sort((a, b) => {
    if (direction === 'asc') {
      return String(getSortable(property, a)).localeCompare(
        String(getSortable(property, b))
      );
    } else {
      return -String(getSortable(property, a)).localeCompare(
        String(getSortable(property, b))
      );
    }
  });

export const orderByArray = (objectArray, orderProp, orderArray, direction) => {
  const sortedObjectArray = orderArray.flatMap((orderKey) =>
    objectArray.filter((item) => item[orderProp] === orderKey)
  );
  return direction !== 'asc' ? sortedObjectArray.reverse() : sortedObjectArray;
};

export const getProperty = (obj, path, fallback) => {
  const parts = path.split('.');
  const key = parts.shift();
  if (typeof obj[key] !== 'undefined') {
    return parts.length > 0
      ? getProperty(obj[key], parts.join('.'), fallback)
      : obj[key];
  }

  return fallback;
};

export const camelCase = (string) =>
  string
    .split(/[-_\W]+/g)
    .map((string) => string.trim())
    .map((string) => string[0].toUpperCase() + string.substring(1))
    .join('');
