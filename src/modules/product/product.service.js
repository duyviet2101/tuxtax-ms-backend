import { BadRequestError } from "../../exception/errorResponse.js";
import { Product } from "../../models/index.js";
import { removeEmptyKeys } from "../../helpers/lodashFuncs.js";
import _ from "lodash";
import { PRODUCT_FIELDS } from "../../constants/product.js";
import CategoriesService from "../categories/categories.service.js";

const createProduct = async (data) => {
  if (data.category) {
    const categoryExists = await CategoriesService.getCategoryByIdOrSlug({slug: data.category});
    if (!categoryExists) {
      throw new BadRequestError("category_not_existed");
    }
  }
  const product = new Product(data);
  return await product.save();
};

const getAllProducts = async ({
  page,
  limit,
  sortBy,
  order,
  search,
  category,
}) => {
  const options = {
    select: PRODUCT_FIELDS,
  };
  if (page) {
    options.page = parseInt(page);
  }
  if (limit) {
    options.limit = parseInt(limit);
  }
  if (sortBy && order) {
    options.sort = { [sortBy]: order };
  }

  const queries = {};
  if (search) {
    queries.name = { $regex: search, $options: "i" };
  }
  if (category) {
    queries.category = category;
  }

  return await Product.paginate({}, options);
};

const getProductBySlug = async (slug) => {
  const parts = slug.split("-");
  const id = parts[parts.length - 1];
  const product = await Product.findById(id);
  if (!product) {
    throw new BadRequestError("product_not_existed");
  }
  return _.pick(product, PRODUCT_FIELDS);
};

const updateProduct = async (id, updatedData) => {
  const data = removeEmptyKeys(updatedData);
  if (_.isEmpty(data)) {
    throw new BadRequestError("data_required");
  }
  const product = await Product.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  if (!product) {
    throw new BadRequestError("product_not_existed");
  }
  return _.pick(product.toObject(), PRODUCT_FIELDS);
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new BadRequestError("product_not_existed");
  }
  return _.pick(product.toObject(), PRODUCT_FIELDS);
};

export default {
  getAllProducts,
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
