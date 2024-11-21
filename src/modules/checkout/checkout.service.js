import sortObject from "../../helpers/sortObject.js";
import qs from "qs";
import * as crypto from "node:crypto";
import config from "../../../config.js";
import dateFormat from "dateformat";
import {Order} from "../../models/index.js";
import {BadRequestError} from "../../exception/errorResponse.js";

const createPaymentUrl = async (req) => {
  const ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;


  const tmnCode = config.vnp_TmnCode;
  const secretKey = config.vnp_HashSecret;
  let vnpUrl = config.vnp_Url;
  const returnUrl = config.vnp_ReturnUrl;

  const date = new Date();
  const orderId = req.body.orderId;
  const order = await Order.findOne({
    _id: orderId,
    isPaid: false
  });
  if (!order) {
    throw new BadRequestError("order_not_existed");
  }
  order.paymentStatus = "pending";
  await order.save();

  const createDate = dateFormat(date, 'yyyymmddHHmmss');
  const TxnRef = await order.CreateBillCode();
  // console.log(TxnRef);
  const amount = order.total;

  const orderInfo = `Thanh toán hoá đơn bàn ${order?.table?.name}. Thành tiền: ${amount} VNĐ`;
  const orderType = "100000";
  let locale = req.body.language;
  if(!locale){
    locale = 'vn';
  }
  const currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = TxnRef;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  vnp_Params['vnp_SecureHash'] = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

  return vnpUrl;
}

const vnpayReturn = async (req) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];
  let TxnRef = vnp_Params['vnp_TxnRef'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;

  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

  if(secureHash === signed){
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    return {
      code: vnp_Params['vnp_ResponseCode']
    }
  } else{
    return {
      code: 97
    }
  }
}

const vnpayIPN = async (req) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let TxnRef = vnp_Params['vnp_TxnRef'];
    const order = await Order.findOne({
      billCode: TxnRef
    });
    if (!order) {
      return {RspCode: '01', Message: 'Order not found'}
    }

    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = config.vnp_HashSecret;

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    let checkAmount = (parseInt(vnp_Params['vnp_Amount']) / 100) === order.total;
    if (!checkAmount) {
      return {RspCode: '04', Message: 'Amount invalid'}
    }
    if (order.paymentStatus !== 'pending') {
      return {RspCode: '02', Message: 'This order has been updated to the payment status'}
    }

    if(secureHash === signed){ //kiểm tra checksum
      if(rspCode==="00"){
        order.paymentStatus = "completed";
        order.isPaid = true;
        order.paidAt = new Date();
        order.checkoutMethod = "banking";
        await order.save();

        return {RspCode: '00', Message: 'Success'}
      }
      else {
        order.paymentStatus = "failed";
        await order.save();

        return {RspCode: '00', Message: 'Success'}
      }
    }
    else {
      return {RspCode: '97', Message: 'Checksum failed'}
    }
  } catch (e) {
    return {RspCode: '99', Message: 'System error'}
  }
}

export default {
  createPaymentUrl,
  vnpayReturn,
  vnpayIPN
}