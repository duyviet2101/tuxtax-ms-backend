import { BadRequestError } from "../../exception/errorResponse.js";
import Product from "../../models/product.model.js";

const getError = async () => {
  throw new BadRequestError();
};

const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

const getAllProducts = async () => {
  const products = await Product.find();
  return products;
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug });
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }
  return product;
};

const updateProduct = async (slug, updatedData) => {
  const product = await Product.findOneAndUpdate({ slug }, updatedData, {
    new: true,
  });
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }
  return product;
};

const deleteProduct = async (slug) => {
  const product = await Product.findOneAndUpdate(
    { slug },
    { deleted: true },
    { new: true }
  );
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }
  return product;
};

export default {
  getAllProducts,
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getError,
};
