import {Router} from "express";
import CheckoutController from "./checkout.controller.js";

const router = Router();

router.post("/create-payment-url", CheckoutController.createPaymentUrl);

router.get("/vnpay-return", CheckoutController.vnpayReturn);

router.get("/vnpay-ipn", CheckoutController.vnpayIPN);

export default router;