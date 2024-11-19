import catchAsync from "../../utils/catchAsync.js";
import DashboardService from "./dashboard.service.js";

const getIncome = catchAsync(async (req, res, next) => {
  const data = await DashboardService.getIncome({
    by: req?.query?.by,
    from: req?.query?.from,
    to: req?.query?.to,
  })
  res.json(data);
});

const getBestSeller = catchAsync(async (req, res, next) => {
  const data = await DashboardService.getBestSeller({
    by: req?.query?.by,
    from: req?.query?.from,
    to: req?.query?.to,
    limit: req?.query?.limit,
  });
  res.json(data);
});

export default {
  getIncome,
  getBestSeller
}