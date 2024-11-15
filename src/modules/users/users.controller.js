import UsersService from "./users.service.js";
import catchAsync from "../../utils/catchAsync.js";

const getUsers = catchAsync(async (req, res, next) => {
  const data = await UsersService.getUsers({
    page: req?.query?.page,
    limit: req?.query?.limit,
    sortBy: req?.query?.sortBy,
    order: req?.query?.order,
  });
  res.json(data);
})

const getUserById = catchAsync(async (req, res, next) => {
  const data = await UsersService.getUserById({
    id: req?.params?.id,
  });
  res.json(data);
})

const createUser = catchAsync(async (req, res, next) => {
  const data = await UsersService.createUser({
    email: req?.body?.email,
    name: req?.body?.name,
    password: req?.body?.password,
    role: req?.body?.role,
    active: req?.body?.active,
    phone: req?.body?.phone
  });
  res.status(201).json(data);
})

const updateUser = catchAsync(async (req, res, next) => {
  const data = await UsersService.updateUser({
    id: req?.params?.id,
    email: req?.body?.email,
    name: req?.body?.name,
    role: req?.body?.role,
    active: req?.body?.active,
    phone: req?.body?.phone
  });
  res.json(data);
})

const deleteUser = catchAsync(async (req, res, next) => {
  const data = await UsersService.deleteUser({
    id: req?.params?.id,
  });
  res.json(data);
})

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}