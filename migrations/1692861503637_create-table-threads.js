/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
      unique: true,
      notNull: true,
    },
    title: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    body: {
      type: "text",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    posting_date: {
      type: "datetime",
      notNull: true,
      default: "NOW() at time zone 'UTC'",
    },
  });

  pgm.addConstraint(
    "threads",
    "fk_threads.owner_users.id",
    "FOREIGN_KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("threads", "fk_threads.owner_users.id");
  pgm.dropTable("threads");
};
