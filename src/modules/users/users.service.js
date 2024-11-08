import {User} from "../../models/index.js";
import {removeEmptyKeys} from "../../helpers/lodashFuncs.js";
import _ from "lodash";
import {BadRequestError} from "../../exception/errorResponse.js";
import {USER_FIELDS} from "../../constants/auth.js";

const createUser = async ({
  email,
  name,
  password,
  role,
  active,
}) => {
  const user = await User.createUser({
    email,
    name,
    password,
    role,
    active,
  });
  return _.pick(user.toObject(), USER_FIELDS);
};

const getUsers = async ({
  page,
  limit,
  sortBy,
  order,
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

  return await User.paginate({}, options);
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
}) => {
  const data = removeEmptyKeys({
    email,
    name,
    role,
    active,
  });
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