import catchAsync from "../../utils/catchAsync.js";
import CheckoutService from "./checkout.service.js";

const createPaymentUrl = catchAsync(async (req, res, next) => {
  const data = await CheckoutService.createPaymentUrl(req);
  res.json(data);
})

const vnpayReturn = catchAsync(async (req, res, next) => {
  const data = await CheckoutService.vnpayReturn(req);
  res.json(data);
})

const vnpayIPN = catchAsync(async (req, res, next) => {
  const data = await CheckoutService.vnpayIPN(req);
  res.json(data);
})

export default {
  createPaymentUrl,
  vnpayReturn,
  vnpayIPN
}