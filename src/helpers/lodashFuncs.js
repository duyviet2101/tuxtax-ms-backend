import _ from "lodash";

const removeEmptyKeys = (obj) => {
  return _.omitBy(obj, (value) =>
    value === null ||
    value === undefined ||
    (_.isObject(value) && _.isEmpty(value)) // Check for empty objects or arrays
  );
};

export {
  removeEmptyKeys
};