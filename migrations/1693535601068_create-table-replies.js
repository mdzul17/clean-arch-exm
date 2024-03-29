/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("replies", {
    id: {
      type: "VARCHAR(50)",
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
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "datetime",
      default: pgm.func("current_timestamp"),
    },
    is_delete: {
      type: "char",
      default: "0",
    },
  });

  pgm.addConstraint(
    "replies",
    "fk_replies.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "replies",
    "fk_replies.thread_id_threads.id",
    "FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "replies",
    "fk_replies.comment_id_comments.id",
    "FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("replies", "fk_replies.owner_users.id");
  pgm.dropConstraint("replies", "fk_replies.thread_id_threads.id");
  pgm.dropConstraint("replies", "fk_replies.comment_id_comments.id");

  pgm.dropTable("replies");
};
