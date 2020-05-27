/* eslint-disable no-buffer-constructor */
const PREFIX = 'mongodbconnection:';

const base64 = (str) => {
  return new Buffer(str, 'ascii').toString('base64');
};

const unbase64 = (b64) => {
  return new Buffer(b64, 'base64').toString('ascii');
};

/**
 * Rederives the offset from the cursor string
 */

const cursorToOffset = (cursor) => {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
};

/**
 * Given an optional cursor and a default offset, returns the offset to use;
 * if the cursor contains a valid offset, that will be used, otherwise it will
 * be the default.
 */

const getOffsetWithDefault = (cursor, defaultOffset) => {
  if (cursor == null) {
    return defaultOffset;
  }

  const offset = cursorToOffset(cursor);

  return Number.isNaN(offset) ? defaultOffset : offset;
};

/**
 * Creates the cursor string from an offset.
 */

const offsetToCursor = (offset) => {
  return base64(PREFIX + offset);
};

const getOffsetsFromArgs = (inArgs, count) => {
  const { after, before, first, last } = inArgs || {};

  const beforeOffset = getOffsetWithDefault(before, count);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = Math.min(count, beforeOffset);

  if (first !== undefined) {
    endOffset = Math.min(endOffset, startOffset + first);
  }

  if (last !== undefined) {
    startOffset = Math.max(startOffset, endOffset - last);
  }

  const skip = Math.max(startOffset, 0);
  const limit = endOffset - startOffset;

  return {
    beforeOffset,
    afterOffset,
    startOffset,
    endOffset,
    skip,
    limit
  };
};

const getConnectionFromSlice = (inSlice, mapper, args, count) => {
  const { first, last, before, after } = args;

  const offsetsFromArgs = getOffsetsFromArgs(args, count);

  const { startOffset, endOffset, beforeOffset, afterOffset } = offsetsFromArgs;

  // If we have a mapper function, map it!
  const slice = typeof mapper === 'function' ? inSlice.map(mapper) : inSlice;

  const edges = slice.map((value, index) => {
    return {
      cursor: offsetToCursor(startOffset + index),
      node: value
    };
  });

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const lowerBound = after ? afterOffset + 1 : 0;
  const upperBound = before ? Math.min(beforeOffset, count) : count;

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: last !== null ? startOffset > lowerBound : false,
      hasNextPage: first !== null ? endOffset < upperBound : false
    }
  };
};

// eslint-disable-next-line no-multi-assign
module.exports = exports = {
  base64,
  unbase64,
  cursorToOffset,
  offsetToCursor,
  getOffsetWithDefault,
  getOffsetsFromArgs,
  getConnectionFromSlice
};
