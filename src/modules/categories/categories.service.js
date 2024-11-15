import {Category, Product} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";
import {removeEmptyKeys} from "../../helpers/lodashFuncs.js";
import parseFilters from "../../helpers/parseFilters.js";
import _ from "lodash";

const getAllCategories = async ({
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

  const queries = {};
  if (search) {
    queries.name = {$regex: search, $options : 'i'};
  }
  if (filters) {
    parseFilters(queries, filters);
  }

  return await Category.paginate(queries, options);
}

const getCategoryByIdOrSlug = async ({
  slug,
  page,
  limit,
  sortBy,
  order,
}) => {
  const options = {
    populate: 'category'
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

  const category = await Category.findById(slug?.split("-")?.at(-1) || "").lean();
  if (!category) {
    throw new BadRequestError('category_not_existed');
  }

  const products = await Product.paginate({category: category._id}, options);

  return {
    category,
    products
  };
}

const createCategory = async ({
  name,
  description,
  image,
  parent,
  active
}) => {
  return await Category.create({
    name,
    description,
    image,
    parent,
    active
  });
};

const updateCategory = async ({
  id,
  name,
  description,
  image,
  parent,
  active
}) => {
  const data = removeEmptyKeys({
    name,
    description,
    image,
    parent,
    active
  });
  const res = await Category.findByIdAndUpdate(id, data, {new: true});
  if (!res) {
    throw new BadRequestError('category_not_existed');
  }

  if (_.isBoolean(active)) {
    await Product.updateMany({
      category: id
    }, {
      status: active ? 'available' : 'not_available'
    });
  }

  return res;
};

const deleteCategory = async ({
  id,
}) => {
  const res = await Category.findByIdAndDelete(id);
  if (!res) {
    throw new BadRequestError('category_not_existed');
  }

  const products = await Product.find({
    category: id
  });
  if (products.length > 0) {
    throw new BadRequestError('category_has_products');
  }

  return res;
};

export default {
  getAllCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
};