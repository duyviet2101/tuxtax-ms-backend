import {User} from "../../models/index.js";
import {removeEmptyKeys} from "../../helpers/lodashFuncs.js";
import _ from "lodash";
import {BadRequestError} from "../../exception/errorResponse.js";
import {USER_FIELDS} from "../../constants/auth.js";
import parseFilters from "../../helpers/parseFilters.js";

const createUser = async ({
  email,
  name,
  password,
  role,
  active,
  phone
}) => {
  const user = await User.createUser({
    email,
    name,
    password,
    role,
    active,
    phone
  });
  return _.pick(user.toObject(), USER_FIELDS);
};

const getUsers = async ({
  page,
  limit,
  sortBy,
  order,
  filters
}) => {
  const options = {
    select: USER_FIELDS,
  };
  if (page) {
    options.page = parseInt(page);
  }
  if (limit) {
    options.limit = parseInt(limit);
  }
  if (sortBy && order) {
    options.sort = {[sortBy]: order};
  }

  const queries = {};
  if (filters) {
    parseFilters(queries, filters);
  }

  return await User.paginate(queries, options);
}

const getUserById = async ({
  id,
}) => {
  const user = await User.findById(id).lean();
  if (!user) {
    throw new BadRequestError("user_not_existed");
  }
  return _.pick(user, USER_FIELDS);
}

const updateUser = async ({
  id,
  email,
  name,
  role,
  active,
  phone
}) => {
  const data = removeEmptyKeys({
    email,
    name,
    role,
    active,
    phone
  });
  console.log(data)
  if (_.isEmpty(data)) {
    throw new BadRequestError("data_required");
  }

  const user = await User.findOneAndUpdate({
    _id: id
  }, data, {
    new: true
  });

  if (!user) {
    throw new BadRequestError("user_not_existed");
  }

  return _.pick(user.toObject(), USER_FIELDS);
}

const deleteUser = async ({
  id,
}) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new BadRequestError("user_not_existed");
  }
  return _.pick(user.toObject(), USER_FIELDS);
}

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
}