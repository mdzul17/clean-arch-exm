/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("comments", {
    is_delete: {
      type: "char",
      notNull: true,
      default: "0",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("comments", "is_delete");
};
