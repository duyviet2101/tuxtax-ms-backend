import productService from "./product.service.js";
import catchAsync from "../../utils/catchAsync.js";

const createProduct = catchAsync(async (req, res, next) => {
  const data = req.body;
  const product = await productService.createProduct(data);
  res.json(product);
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const data = req.query;
  const product = await productService.getAllProducts(data);
  res.json(product);
});

const getProductBySlug = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const data = await productService.getProductBySlug(slug);
  res.json(data);
});

const updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedData = req.body;
  const data = await productService.updateProduct(id, updatedData);
  res.json(data);
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = await productService.deleteProduct(id);
  res.json(data);
});

export default {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
