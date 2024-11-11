import {Floor, Table} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";

const getAllFloors = async ({
  page,
  limit,
  sortBy,
  order,
  search
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

  return await Floor.paginate(query, options);
}

const getFloorBySlug = async ({
  slug,
  page,
  limit,
  sortBy,
  order,
}) => {
  const floor = await Floor.findById(slug?.split('-')?.at(-1)).lean();
  if (!floor) {
    throw new BadRequestError('floor_not_existed');
  }

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

  const tables = await Table.paginate({floor: floor._id}, options);

  return {
    floor,
    tables
  };
}

const createFloor = async ({
  name
}) => {
  const floor = new Floor({
    name
  });
  return await floor.save();
}

const updateFloor = async ({
  id,
  name
}) => {
  const floor = await Floor.findOneAndUpdate({
    _id: id
  }, {
    name
  }, {
    new: true
  });
  if (!floor) {
    throw new BadRequestError('floor_not_existed');
  }
  return floor;
}

const deleteFloor = async ({
  id
}) => {
  const floor = await Floor.findByIdAndDelete(id);
  if (!floor) {
    throw new BadRequestError('floor_not_existed');
  }
  return floor;
}

export default {
  getAllFloors,
  getFloorBySlug,
  createFloor,
  updateFloor,
  deleteFloor
}