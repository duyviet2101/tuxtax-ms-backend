import catchAsync from "../../utils/catchAsync.js";
import OrdersService from "./ orders.service.js";

const createOrder = catchAsync(async (req, res, next) => {
  const data = await OrdersService.createOrder({
    table: req?.body?.table,
    products: req?.body?.products,
  });
  res.status(201).json(data);
});

const getOrders = catchAsync(async (req, res, next) => {
  const data = await OrdersService.getOrders({
    page: req?.query?.page,
    limit: req?.query?.limit,
    sortBy: req?.query?.sortBy,
    order: req?.query?.order,
  });
  res.json(data);
});

const getOrderById = catchAsync(async (req, res, next) => {
  const data = await OrdersService.getOrderById({
    id: req?.params?.id,
  });
  res.json(data);
});

const updateStatusOrder = catchAsync(async (req, rest, next) => {
  const data = await OrdersService.updateStatusOrder({
    id: req?.params?.id,
    status: req?.body?.status,
  });
  res.json(data);
});

const updateQuantityProduct = catchAsync(async (req, res, next) => {
  const data = await OrdersService.updateQuantityProduct({
    id: req?.params?.id,
    product: req?.body?.product,
    quantity: req?.body?.quantity,
  });
  res.json(data);
});

const deleteProductInOrder = catchAsync(async (req, res, next) => {
  const data = await OrdersService.deleteProductInOrder({
    id: req?.params?.id,
    product: req?.params?.productId,
  });
  res.json(data);
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const data = await OrdersService.deleteOrder({
    id: req?.params?.id,
  })
  res.json(data);
});

const addProductToOrder = catchAsync(async (req, res, next) => {
  const data = await OrdersService.addProductToOrder({
    id: req?.params?.id,
    product: req?.body?.product,
    quantity: req?.body?.quantity,
  });
  res.json(data);
});

const updateIsPaidOrder = catchAsync(async (req, res, next) => {
  const data = await OrdersService.updateIsPaidOrder({
    id: req?.params?.id,
    isPaid: req?.body?.isPaid,
  });
  res.json(data);
});

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateStatusOrder,
  updateQuantityProduct,
  deleteProductInOrder,
  deleteOrder,
  updateIsPaidOrder,
  addProductToOrder
}