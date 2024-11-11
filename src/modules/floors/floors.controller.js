import catchAsync from "../../utils/catchAsync.js";
import FloorsService from "./floors.service.js";

const getAllFloors = catchAsync(async (req, res, next) => {
  const data = await FloorsService.getAllFloors({
    page: req?.query?.page,
    limit: req?.query?.limit,
    sortBy: req?.query?.sortBy,
    order: req?.query?.order,
    search: req?.query?.search
  });
  res.json(data);
})

const getFloorBySlug = catchAsync(async (req, res, next) => {
  const data = await FloorsService.getFloorBySlug(req?.params?.slug);
  res.json(data);
});

const createFloor = catchAsync(async (req, res, next) => {
  const floor = await FloorsService.createFloor({
    name: req?.body?.name
  });
  res.json(floor);
});

const updateFloor = catchAsync(async (req, res, next) => {
  const floor = await FloorsService.updateFloor({
    id: req?.params?.id,
    name: req?.body?.name
  });
  res.json(floor);
});

const deleteFloor = catchAsync(async (req, res, next) => {
  const data = await FloorsService.deleteFloor({
    id: req?.params?.id
  });
  res.json(data);
});

export default {
  getAllFloors,
  getFloorBySlug,
  createFloor,
  updateFloor,
  deleteFloor
};