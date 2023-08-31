/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "datetime",
      default: pgm.func("current_timestamp"),
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  // pgm.addConstraint(
  //   "comments",
  //   "fk_comments.owner_users.id",
  //   "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  // );
  // pgm.addConstraint(
  //   "comments",
  //   "fk_comments.thread_id_threads.id",
  //   "FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE"
  // );
};

exports.down = (pgm) => {
  // pgm.dropConstraint("comments", "fk_comments.owner_users.id");
  // pgm.dropConstraint("comments", "fk_comments.thread_id_threads.id");
  pgm.dropTable("comments");
};
