const { getOffsetsFromArgs, getConnectionFromSlice } = require('./utils');

/**
 * Accepts a mongodb cursor and connection arguments, and returns a connection
 * object for use in GraphQL. It uses array offsets as pagination, so pagiantion
 * will work only if the data set is satic.
 */

const connectionFromMongoCursor = (inMongoCursor, inArgs, mapper) => {
  const args = inArgs || {};
  const mongodbCursor = inMongoCursor.clone();

  // Because getting count from cursor in sharded DB is very slow
  const collectionName = mongodbCursor.cmd.find.replace(/^[^.]+\./, '');
  const { query } = mongodbCursor.cmd;
  const countPromise = mongodbCursor.options.db.collection(collectionName).countDocuments(query);

  return countPromise.then((count) => {
    const pagination = getOffsetsFromArgs(args, count);

    // Short circuit if limit is 0; in that case, mongodb doesn't limit at all
    if (pagination.limit === 0) {
      return getConnectionFromSlice([], mapper, args, count);
    }

    // If the supplied slice is too large, trim it down before mapping over it
    mongodbCursor.skip(pagination.skip);
    mongodbCursor.limit(pagination.limit);

    return mongodbCursor.toArray().then((slice) => {
      return getConnectionFromSlice(slice, mapper, args, count);
    });
  });
};

module.exports = connectionFromMongoCursor;
