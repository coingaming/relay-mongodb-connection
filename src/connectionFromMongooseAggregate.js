const { getOffsetsFromArgs, getConnectionFromSlice } = require('./utils');

const cloneAggregation = (aggr) => {
  const model = aggr._model.model(aggr._model.modelName);
  return model.aggregate(aggr._pipeline);
};

const connectionFromMongooseAggregate = (aggr, inArgs, mapper) => {
  const args = inArgs || {};
  const countAggr = cloneAggregation(aggr);

  return countAggr
    .group({ _id: null, count: { $sum: 1 } })
    .exec()
    .then((countArr) => {
      const count = countArr.length > 0 && countArr[0].count ? countArr[0].count : 0;
      const pagination = getOffsetsFromArgs(args, count);

      if (pagination.limit <= 0) {
        return getConnectionFromSlice([], mapper, args, count);
      }

      aggr.skip(pagination.skip);
      aggr.limit(pagination.limit);

      return aggr.exec()
        .then((slice) => {
          return getConnectionFromSlice(slice, mapper, args, count);
        });
    });
};

module.exports = connectionFromMongooseAggregate;
