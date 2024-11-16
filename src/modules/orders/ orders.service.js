import {Floor, Order, Product, Table} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";
import parseFilters from "../../helpers/parseFilters.js";

const createOrder = async ({
  table,
  products,
}) => {
  const tableExist = await Table.findById(table);
  if (!tableExist) {
    throw new BadRequestError("table_not_existed");
  }

  for (const item of products) {
    const productExist = await Product.findById(item.product);
    if (!productExist) {
      throw new BadRequestError(`product_${item.product}_not_existed`);
    }
  }

  // Calculate total
  const total = products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const order = await Order.create({
    table,
    products,
    total,
  });

  return order;
}

const getOrders = async ({
  page,
  limit,
  sortBy,
  order,
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
  if (filters) {
    parseFilters(queries, filters);
  }

  return await Order.paginate(queries, options);
}

const getOrderById = async ({
  id,
}) => {
  const order = await Order.findById(id).lean({autopopulate: true});

  const floor = await Floor.findById(order.table.floor).lean();
  order.table.floor = floor;

  if (!order) {
    throw new BadRequestError("order_not_existed");
  }

  return order;
}

const updateStatusOrder = async ({
  id,
  status
}) => {
  const order = await Order.findOneAndUpdate({
    _id: id
  }, {
    status
  }, {
    new: true
  });
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  return order;
}

const deleteOrder = async ({
  id
}) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  return order;
}

const updateQuantityProduct = async ({
  id,
  product,
  newQuantity
}) => {
  const order = await Order.findById(id, {}, {autopopulate: false});
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }

  const productIndex = order.products.findIndex(item => item.product.toString() === product);
  if (productIndex === -1) {
    throw new BadRequestError("product_not_existed");
  }

  order.products[productIndex].quantity = newQuantity;

  //cal total
  order.total = order.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  await order.save();
  return order;
}

const deleteProductInOrder = async ({
  id,
  product
}) => {
  const order = await Order.findById(id, {}, {autopopulate: false});
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }

  const productIndex = order.products.findIndex(item => item.product.toString() === product);
  if (productIndex === -1) {
    throw new BadRequestError("product_not_existed");
  }

  order.products.splice(productIndex, 1);

  //cal total
  order.total = order.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  await order.save();
  return order;
}

const addProductToOrder = async ({
  id,
  product,
  quantity
}) => {
  const order = await Order.findById(id, {}, {autopopulate: false});
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }

  const productExist = await Product.findById(product);
  if (!productExist) {
    throw new BadRequestError("product_not_existed");
  }

  const productIndex = order.products.findIndex(item => item.product.toString() === product);
  if (productIndex !== -1) {
    order.products[productIndex].quantity = quantity;
  } else {
    order.products.push({
      product,
      quantity,
      price: productExist.price,
    });
  }
}

const updateIsPaidOrder = async ({
  id,
  isPaid
}) => {
  const order = await Order.findByIdAndUpdate(id, {
    isPaid
  }, {
    new: true
  });
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  return order;
}

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateStatusOrder,
  deleteOrder,
  updateQuantityProduct,
  deleteProductInOrder,
  addProductToOrder,
  updateIsPaidOrder
};