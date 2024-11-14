import catchAsync from "../../utils/catchAsync.js";
import CategoriesService from "./categories.service.js";

const getAllCategories = catchAsync(async (req, res, next) => {
  const data = await CategoriesService.getAllCategories({
    page: req?.query?.page,
    limit: req?.query?.limit,
    sortBy: req?.query?.sortBy,
    order: req?.query?.order,
    search: req?.query?.search,
  });
  res.json(data);
});

const getCategoryByIdOrSlug = catchAsync(async (req, res, next) => {
  const data = await CategoriesService.getCategoryByIdOrSlug({
    slug: req?.params?.slug,
    page: req?.query?.page,
    limit: req?.query?.limit,
    sortBy: req?.query?.sortBy,
    order: req?.query?.order,
  });
  res.json(data);
});

const createCategory = catchAsync(async (req, res, next) => {
  const data = await CategoriesService.createCategory({
    name: req?.body?.name,
    description: req?.body?.description,
    image: req?.body?.image,
    parent: req?.body?.parent,
  });
  res.status(201).json(data);
});

const updateCategory = catchAsync(async (req, res, next) => {
  const data = await CategoriesService.updateCategory({
    id: req?.params?.id,
    name: req?.body?.name,
    description: req?.body?.description,
    image: req?.body?.image,
    parent: req?.body?.parent,
  });
  res.json(data);
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const data = await CategoriesService.deleteCategory({
    id: req?.params?.id,
  });
  res.json(data);
});

export default {
  getAllCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
}