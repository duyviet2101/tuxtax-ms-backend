import _ from "lodash";
import moment from "moment";
import "moment/locale/vi.js";
import {Order} from "../../models/index.js";

const getIncome = async ({
  by,
  from,
  to,
}) => {
  if (!_.isEmpty(from)) {
    from = moment(from).toDate();
  } else {
    from = moment().startOf(by === "today" ? "day" : by).toDate();
  }
  if (!_.isEmpty(to)) {
    to = moment(to).toDate();
  } else {
    to = moment().endOf(by === "today" ? "day" : by).toDate();
  }

  const matchObj = {
    'paidAt': {
      '$gte': from,
      '$lte': to
    }
  }

  const groupObj = {
    '_id': {
      '$dateToString': {
        'format': '%Y-%m-%d' + (by === 'today' ? '_%H' : ''),
        'date': '$paidAt',
        'timezone': 'Asia/Ho_Chi_Minh'
      }
    },
    'total': {
      '$sum': '$total'
    },
    'count': {
      '$sum': 1
    }
  };

  if (by === 'month') {
    groupObj._id['$dateToString']['format'] = '%Y-%m';
  } else if (by === 'year') {
    groupObj._id['$dateToString']['format'] = '%Y';
  }

  const incomes = await Order.aggregate([
    {
      '$match': matchObj
    },
    {
      '$group': groupObj
    },
    {
      '$sort': {
        '_id': 1
      }
    },
  ])

  const processIncomes = (incomes, from, to) => {
    const dateMap = new Map(incomes.map(item => [item._id, item]));
    const res = [];
    let currDate = moment(from);
    while (currDate.isBefore(moment(to))) {
      let key = currDate.format(by === 'today' ? 'YYYY-MM-DD_HH' : by === 'day' ? 'YYYY-MM-DD' : by === 'month' ? 'YYYY-MM' : 'YYYY');
      res.push({
        _id: by === "today" ? currDate.format('HH:mm') : key,
        total: dateMap.has(key) ? dateMap.get(key).total : 0,
        count: dateMap.has(key) ? dateMap.get(key).count : 0
      });
      currDate = currDate.add(1, by === 'today' ? 'hour' : by);
    }
    return res;
  }


  return {
    incomes: processIncomes(incomes, from, to),
    total: incomes.reduce((acc, item) => acc + item.total, 0),
    orders: incomes.reduce((acc, item) => acc + item.count, 0),
    matchObj,
    groupObj
  }
}

const getBestSeller = async ({
  limit = 10,
  by,
}) => {
  const from = moment().startOf(by).toDate();
  const to = moment().endOf(by).toDate();

  const matchObj = {
    'paidAt': {
      '$gte': from,
      '$lte': to
    },
    'isPaid': true
  }

  const groupObj = {
    '_id': '$products.product',
    'quantity': {
      '$sum': '$products.quantity'
    }
  };

  const bestSellers = await Order.aggregate([
    {
      '$match': matchObj
    },
    {
      '$unwind': '$products'
    },
    {
      '$group': groupObj
    },
    {
      '$sort': {
        'quantity': -1
      }
    },
    {
      '$limit': parseInt(limit)
    },
    {
      '$lookup': {
        'from': 'products',
        'localField': '_id',
        'foreignField': '_id',
        'as': 'product'
      }
    },
    {
      '$unwind': '$product'
    },
    {
      '$project': {
        '_id': 0,
        'product': 1,
        'quantity': 1
      }
    }
  ])

  return {
    bestSellers,
    matchObj,
    groupObj
  }
}

export default {
  getIncome,
  getBestSeller
}