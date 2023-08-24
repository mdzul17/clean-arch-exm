const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");
const ThreadsRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const PostedThread = require("../../../Domains/threads/entities/PostedThread");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsRepositoryPostgres.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist register user", async () => {
      const addThread = new NewThread({
        title: "title",
        content: "123456",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new threadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgres.addThread(addThread);

      const thread = await ThreadsTableTestHelper.getThreadById("thread-123");
      expect(thread).toHaveLength(1);
    });

    it("should return registered user correctly", async () => {
      const addThread = new NewThread({
        title: "title",
        content: "123456",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const newThread = await threadRepositoryPostgres.addThread(addThread);

      expect(newThread).toStrictEqual(
        new PostedThread({
          id: "thread-123",
          title: "title",
          content: "123456",
        })
      );
    });
  });
});
