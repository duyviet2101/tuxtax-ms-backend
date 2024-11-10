import { BadRequestError } from "../../exception/errorResponse.js";
import { Product } from "../../models/index.js";
import { removeEmptyKeys } from "../../helpers/lodashFuncs.js";
import _ from "lodash";
import { PRODUCT_FIELDS } from "../../constants/product.js";

const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

const getAllProducts = async (data) => {
  const options = {
    select: PRODUCT_FIELDS,
  };
  if (data.page) {
    options.page = parseInt(data.page);
  }
  if (data.limit) {
    options.limit = parseInt(data.limit);
  }
  if (data.sortBy && data.order) {
    options.sort = { [data.sortBy]: data.order };
  }

  return await Product.paginate({}, options);
};

const getProductBySlug = async (slug) => {
  const parts = slug.split("-");
  const id = parts[parts.length - 1];
  const product = await Product.findById(id).lean();
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
