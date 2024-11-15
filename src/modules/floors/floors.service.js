import {Floor, Table} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";
import {removeEmptyKeys} from "../../helpers/lodashFuncs.js";
import parseFilters from "../../helpers/parseFilters.js";
import _ from "lodash";

const getAllFloors = async ({
  page,
  limit,
  sortBy,
  order,
  search,
  filters
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
  if (filters) {
    parseFilters(query, filters);
  }

  return await Floor.paginate(query, options);
}

const getFloorBySlug = async ({
  slug,
}) => {
  const floor = await Floor.findById(slug?.split('-')?.at(-1)).lean();
  if (!floor) {
    throw new BadRequestError('floor_not_existed');
  }

  return floor;
}

const createFloor = async ({
  name,
  active
}) => {
  const floor = new Floor({
    name,
    active
  });
  return await floor.save();
}

const updateFloor = async ({
  id,
  name,
  active
}) => {
  const data = removeEmptyKeys({
    name,
    active
  })

  const floor = await Floor.findOneAndUpdate({
    _id: id
  }, data, {
    new: true
  });
  if (!floor) {
    throw new BadRequestError('floor_not_existed');
  }

  if (_.isBoolean(data.active)) {
    await Table.updateMany({
      floor: id
    }, {
      active: data.active
    });
  }

  return floor;
}

const deleteFloor = async ({
  id
}) => {
  const tables = await Table.find({
    floor: id
  });
  if (tables.length > 0) {
    throw new BadRequestError('floor_has_tables');
  }

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