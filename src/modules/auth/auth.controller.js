import catchAsync from "../../utils/catchAsync.js";
import AuthService from "./auth.service.js";

const login = catchAsync(async (req, res, next) => {
  const data = await AuthService.login({
    email: req.body.email,
    password: req.body.password,
  });
  res.json(data);
});

const changePassword = catchAsync(async (req, res, next) => {
  const data = await AuthService.changePassword({
    id: req.user._id,
    oldPass: req.body.oldPass,
    newPass: req.body.newPass,
  });
  res.json(data);
});

export default {
  login,
  changePassword
}