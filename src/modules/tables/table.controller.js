import catchAsync from "../../utils/catchAsync.js";
import TablesService from "./tables.service.js";

const getAllTables = catchAsync(async (req, res, next) => {
  const data = await TablesService.getAllTables({
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    order: req.query.order,
    search: req.query.search,
    floor: req.query.floor,
  });
  res.json(data);
});

const getTableById = catchAsync(async (req, res, next) => {
  const data = await TablesService.getTableById(req?.params?.id);
  res.json(data);
});

const createTable = catchAsync(async (req, res, next) => {
  const data = await TablesService.createTable({
    name: req?.body?.name,
    floor: req?.body?.floor,
    capacity: req?.body?.capacity,
  });
  res.status(201).json(data);
});

const updateTable = catchAsync(async (req, res, next) => {
  const data = await TablesService.updateTable({
    id: req?.params?.id,
    name: req?.body?.name,
    floor: req?.body?.floor,
    capacity: req?.body?.capacity,
  });
  res.json(data);
});

const deleteTable = catchAsync(async (req, res, next) => {
  const data = await TablesService.deleteTable(req?.params?.id);
  res.json(data);
})

export default {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
}