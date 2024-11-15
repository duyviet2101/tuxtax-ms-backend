import productService from "./product.service.js";
import catchAsync from "../../utils/catchAsync.js";

const createProduct = catchAsync(async (req, res, next) => {
  const data = req.body;
  const product = await productService.createProduct({
    name: data?.name,
    price: data?.price,
    image: data?.image,
    description: data?.description,
    category: data?.category,
    quantity: data?.quantity,
    status: data?.status,
  });
  res.status(201).json(product);
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const product = await productService.getAllProducts({
    page: req?.query?.page,
    limit: req?.query?.limit,
    sortBy: req?.query?.sortBy,
    order: req?.query?.order,
    search: req?.query?.search,
    category: req?.query?.category,
    filters: req?.query?.filters,
  });
  res.json(product);
});

const getProductBySlug = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const data = await productService.getProductBySlug(slug);
  res.json(data);
});

const updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const product = await productService.updateProduct(id, {
    name: data?.name,
    price: data?.price,
    image: data?.image,
    description: data?.description,
    category: data?.category,
    quantity: data?.quantity,
    status: data?.status,
  });
  res.json(product);
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
