import {Floor, Table} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";
import {removeEmptyKeys} from "../../helpers/lodashFuncs.js";

const getAllTables = async ({
  page,
  limit,
  sortBy,
  order,
  search,
  floor
}) => {
  const options = {};
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

  return await Table.paginate(query, options);
}

const getTableById = async (id) => {
  const res = await Table.findById(id).populate('floor').lean();
  if (!res) {
    throw new BadRequestError('table_not_existed');
  }
  return res;
}

const createTable = async ({
  name,
  floor,
  capacity
}) => {
  const floorExists = await Floor.findById(floor);
  if (!floorExists) {
    throw new BadRequestError('floor_not_existed');
  }

  return await Table.create({
    name,
    floor,
    capacity
  });
}

const updateTable = async ({
  id,
  name,
  floor,
  capacity
}) => {
  const data = removeEmptyKeys({
    name,
    floor,
    capacity
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