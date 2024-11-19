import {Floor, Order, Table} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";
import {removeEmptyKeys} from "../../helpers/lodashFuncs.js";
import parseFilters from "../../helpers/parseFilters.js";

const getAllTables = async ({
  page,
  limit,
  sortBy,
  order,
  search,
  floor,
  filters
}) => {
  const options = {
    populate: "floor",
    lean: true
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

  const query = {};
  if (search) {
    query.name = new RegExp(search, 'i');
  }
  if (floor) {
    query.floor = floor;
  }
  if (filters) {
    parseFilters(query, filters);
  }

  const tables = await Table.paginate(query, options);
  for (const table of tables.docs) {
    const order = await Order.findOne({
      table: table._id,
      $or: [{status: 'pending'}, {isPaid: false}]
    });
    if (order) {
      table.order = order;
    }
  }
  return tables;
}

const getTableById = async (id) => {
  const res = await Table.findById(id).populate('floor').lean();

  const order = await Order.findOne({
    table: res._id,
    status: 'pending'
  });
  if (order) {
    res.order = order;
  }

  if (!res) {
    throw new BadRequestError('table_not_existed');
  }
  return res;
}

const createTable = async ({
  name,
  floor,
  capacity,
  active
}) => {
  const floorExists = await Floor.findById(floor);
  if (!floorExists) {
    throw new BadRequestError('floor_not_existed');
  }

  return await Table.create({
    name,
    floor,
    capacity,
    active: active && floorExists.active
  });
}

const updateTable = async ({
  id,
  name,
  floor,
  capacity,
  active
}) => {
  const data = removeEmptyKeys({
    name,
    floor,
    capacity,
    active
  })

  if (data.floor) {
    const floorExists = await Floor.findById(data?.floor);
    if (!floorExists) {
      throw new BadRequestError('floor_not_existed');
    }
  }


  const res = await Table.findByIdAndUpdate(id, data, {
    new: true
  });
  if (!res) {
    throw new BadRequestError('table_not_existed');
  }
  return res;
}

const deleteTable = async (id) => {
  const res = await Table.findByIdAndDelete(id);
  if (!res) {
    throw new BadRequestError('table_not_existed');
  }
  return res;
}

export default {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
}