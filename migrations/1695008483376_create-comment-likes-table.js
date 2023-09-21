/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comment_likes", {
    user_id: {
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
  });

  pgm.addConstraint(
    "comment_likes",
    "fk_comment_likes.thread_id_threads.id",
    "FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "comment_likes",
    "fk_comment_likes.comment_id_comments.id",
    "FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("comment_likes", "fk_thread_likes.thread_id_threads.id");
  pgm.dropConstraint(
    "comment_likes",
    "fk_comment_likes.comment_id_comments.id"
  );
  pgm.dropTable("comment_likes");
};
