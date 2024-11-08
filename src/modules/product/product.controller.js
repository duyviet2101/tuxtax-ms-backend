import productService from "./product.service.js";
import catchAsync from "../../utils/catchAsync.js";

const getError = catchAsync(async (req, res, next) => {
  const data = await productService.getError();
  res.json(data);
});

const createProduct = catchAsync(async (req, res, next) => {
  const data = req.body;
  const product = await productService.createProduct(data);
  res.json(product);
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const data = await productService.getAllProducts();
  res.json(data);
});

const getProductBySlug = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const data = await productService.getProductBySlug(slug);
  res.json(data);
});

const updateProduct = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const updatedData = req.body;
  const data = await productService.updateProduct(slug, updatedData);
  res.json(data);
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const data = await productService.deleteProduct(slug);
  res.json(data);
});

export default {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getError,
};
