import _ from "lodash";

const removeEmptyKeys = (obj) => {
  return _.omitBy(obj, _.isEmpty);
}

export {
  removeEmptyKeys
}