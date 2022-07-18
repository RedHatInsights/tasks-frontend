import React from 'react';
import moment from 'moment';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';

const renderRunning = (time) => {
  return time === 'null' || !time ? 'Running' : false;
};

export const renderRunDateTime = (time) => {
  if (time === 'loading') {
    return <Skeleton size={SkeletonSize.md} />;
  } else {
    return (
      renderRunning(time) || moment.utc(time).format('DD MMM YYYY, HH:mm UTC')
    );
  }
};

export const getTimeDiff = ([start, end]) => {
  if (start === 'loading') {
    return <Skeleton size={SkeletonSize.md} />;
  } else {
    return (
      renderRunning(end) ||
      `${renderRunDateTime(end)} (${moment
        .duration(
          moment(renderRunDateTime(end), 'DD MMM YYYY, HH:mm').diff(
            moment(renderRunDateTime(start), 'DD MMM YYYY HH:mm')
          )
        )
        .asMinutes()} min)`
    );
  }
};

export const uniq = (collection) => [...new Set(collection)];

/*eslint-disable react/display-name*/
export const renderColumnComponent =
  (Component, props) => (_data, _id, entity) =>
    <Component {...entity} {...props} />;
/*eslint-enable react/display-name*/

export const orderArrayByProp = (property, objects, direction) =>
  objects.sort((a, b) => {
    if (direction === 'asc') {
      if (typeof a[property] === 'number') {
        return a[property] - b[property];
      } else {
        return String(a[property]).localeCompare(String(b[property]));
      }
    } else {
      if (typeof a[property] === 'number') {
        return -a[property] + b[property];
      } else {
        return -String(a[property]).localeCompare(String(b[property]));
      }
    }
  });

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

export const camelCase = (string) => {
  return string
    .split(/[-_\W]+/g)
    .map((string) => string.trim())
    .map((string) => string[0].toUpperCase() + string.substring(1))
    .join('');
};
