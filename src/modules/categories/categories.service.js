import {Category, Product} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";
import {removeEmptyKeys} from "../../helpers/lodashFuncs.js";

const getAllCategories = async ({
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

  const queries = {};
  if (search) {
    queries.name = {$regex: search, $options : 'i'};
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
}) => {
  return await Category.create({
    name,
    description,
    image,
    parent
  });
};

const updateCategory = async ({
  id,
  name,
  description,
  image,
  parent,
}) => {
  const data = removeEmptyKeys({
    name,
    description,
    image,
    parent,
  });
  const res = await Category.findByIdAndUpdate(id, data, {new: true});
  if (!res) {
    throw new BadRequestError('category_not_existed');
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
  return res;
};

export default {
  getAllCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
};