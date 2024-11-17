import {Floor, Order, Product, Table} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";
import parseFilters from "../../helpers/parseFilters.js";
import {removeEmptyKeys} from "../../helpers/lodashFuncs.js";

const createOrder = async ({
  table,
  products,
  name,
  phone,
  isSplit = false
}) => {
  const tableExist = await Table.findById(table);
  if (!tableExist) {
    throw new BadRequestError("table_not_existed");
  }
  const orderExist = await Order.findOne({
    table,
    status: {
      $in: ["pending"]
    }
  });
  if (orderExist) {
    throw new BadRequestError("table_has_order_pending");
  }

  for (const item of products) {
    const productExist = await Product.findById(item.product);
    if (!productExist) {
      throw new BadRequestError(`product_${item.product}_not_existed`);
    }
    if (!isSplit) {
      if (productExist.quantity < item.quantity) {
        throw new BadRequestError(`product_${item.product}_quantity_not_enough`);
      }
      productExist.quantity -= item.quantity;
    }
    await productExist.save();
  }

  const total = products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const order = await Order.create({
    table,
    products,
    total,
    name: name ? name : "Khách lẻ",
    phone: phone ? phone : "N/A"
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
  status,
  table
}) => {
  const data = removeEmptyKeys({
    status,
    table
  });
  if (!data) {
    throw new BadRequestError("data_required");
  }

  const order = await Order.findOneAndUpdate({
    _id: id
  }, data, {
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

  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        quantity: item.quantity
      }
    });
  }

  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  return order;
}

const updateQuantityProduct = async ({
  id,
  product,
  option = "",
  quantity,
  price,
  status
}) => {
  if (!quantity && !price && !status) {
    return;
  }
  const order = await Order.findById(id, {}, {autopopulate: false});
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }

  const productIndex = order.products.findIndex(item => item.product.toString() === product && item.option === option);
  if (productIndex === -1) {
    throw new BadRequestError("product_not_existed");
  }
  if (quantity) {
    const productItem = await Product.findById(product);
    if (productItem.quantity + order.products[productIndex].quantity < quantity) {
      throw new BadRequestError("quantity_not_enough");
    }
    await Product.findByIdAndUpdate(product, {
      $inc: {
        quantity: order.products[productIndex].quantity - quantity
      }
    });
    order.products[productIndex].quantity = quantity;
  }
  if (price) {
    order.products[productIndex].price = price;
  }
  if (status) {
    order.products[productIndex].status = status;
  }

  //cal total
  order.total = order.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  await order.save();
  return order;
}

const deleteProductInOrder = async ({
  id,
  product,
  option = ""
}) => {
  const order = await Order.findById(id, {}, {autopopulate: false});
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  const productIndex = order.products.findIndex(item => item.product.toString() === product && item.option === option);
  if (productIndex === -1) {
    throw new BadRequestError("product_not_existed");
  }

  await Product.findByIdAndUpdate(product, {
    $inc: {
      quantity: order.products[productIndex].quantity
    }
  });

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
  quantity,
  option = ""
}) => {
  const order = await Order.findById(id, {}, {autopopulate: false});
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }

  const productExist = await Product.findById(product);
  if (!productExist) {
    throw new BadRequestError("product_not_existed");
  }
  if (productExist.quantity < quantity) {
    throw new BadRequestError("quantity_not_enough");
  }

  const productIndex = order.products.findIndex(item => item.product.toString() === product && item.option === option);

  await Product.findByIdAndUpdate(product, {
    $inc: {
      quantity: -quantity
    }
  });

  if (productIndex !== -1) {
    order.products[productIndex].quantity += parseInt(quantity);
  } else {
    order.products.push({
      product,
      quantity,
      option,
      price: productExist.price,
    });
  }

  //cal total
  order.total = order.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  await order.save();
  return order;
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

const updateInfoOrder = async ({
  id,
  name,
  phone
}) => {
  const order = await Order.findByIdAndUpdate(id, {
    name,
    phone
  }, {
    new: true
  });
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  return order;
}

const splitTable = async ({
  id,
  to,
  products = []
}) => {
  const order = await Order.findById(id, {}, {autopopulate: false});
  const tableTo = await Table.findById(to);
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  if (!tableTo) {
    throw new BadRequestError("table_not_existed");
  }

  const productsSplit = order.products.filter(item => products.includes(item._id.toString()));

  const res = await createOrder({
    table: to,
    products: productsSplit,
    name: order.name,
    phone: order.phone,
    isSplit: true
  })

  order.products = order.products.filter(item => !products.includes(item._id.toString()));
  order.total = order.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  if (order.products.length === 0) {
    await Order.findByIdAndDelete(order._id);
  } else {
    await order.save();
  }


  return res;
}

const mergeTable = async ({
  id,
  from
}) => {
  const order = await Order.findById(id, {}, {autopopulate: false});
  const tableFrom = await Table.findById(from);
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  if (!tableFrom) {
    throw new BadRequestError("table_not_existed");
  }

  const orderFrom = await Order.findOne({
    table: from
  }, {}, {autopopulate: false});
  if (!orderFrom) {
    throw new BadRequestError("order_not_existed");
  }

  orderFrom.products.forEach(item => {
    const productIndex = order.products.findIndex(product => product.product.toString() === item.product.toString() && product.option === item.option);
    if (productIndex !== -1) {
      order.products[productIndex].quantity += item.quantity;
    } else {
      order.products.push(item);
    }
  });

  order.total = order.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  await order.save();
  await Order.findByIdAndDelete(orderFrom._id);
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
  updateIsPaidOrder,
  updateInfoOrder,
  splitTable,
  mergeTable
};