const { getOffsetsFromArgs, getConnectionFromSlice } = require('./utils');

const connectionFromMongooseQuery = (query, inArgs, mapper) => {
  const args = inArgs || {};

  return query.count()
    .then((count) => {
      const pagination = getOffsetsFromArgs(args, count);

      if (pagination.limit === 0) {
        return getConnectionFromSlice([], mapper, args, count);
      }

      query.skip(pagination.skip);
      query.limit(pagination.limit);

      // Convert all Mongoose documents to objects
      query.lean();

      return query.find().then((slice) => {
        return getConnectionFromSlice(slice, mapper, args, count);
      });
    });
};

module.exports = connectionFromMongooseQuery;
