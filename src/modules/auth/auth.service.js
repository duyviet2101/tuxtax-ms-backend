import {User} from "../../models/index.js";
import {AuthenticationError, BadRequestError} from "../../exception/errorResponse.js";
import {createJwtAccessToken} from "../../utils/jwt.js";
import _ from "lodash";
import {USER_FIELDS} from "../../constants/auth.js";

const login = async ({
  email,
  password
}) => {
  const user = await User.findOne({
    email: email
  }).select("-__v -createdAt -updatedAt");
  if (!user)
      throw new BadRequestError("user_not_existed");

  if (!(await user.isValidPassword(password))) {
    throw new AuthenticationError("wrong_password");
  }

  if (!user.active) {
    throw new AuthenticationError("account_not_active");
  }

  return {
    data: _.pick(user.toObject(), USER_FIELDS),
    accessToken: createJwtAccessToken({
      email: user.email,
      role: user.role,
    })
  };
}

const changePassword = async ({
  id,
  oldPass,
  newPass
}) => {
  const user = await User.findById(id);
  if (!user) {
    throw new BadRequestError("user_not_existed");
  }
  await user.changePassword({oldPass, newPass});
  return {
    data: _.pick(user.toObject(), USER_FIELDS),
    accessToken: createJwtAccessToken({
      email: user.email,
      role: user.role,
    })
  }
}

export default {
  login,
  changePassword
}