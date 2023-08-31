const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const PostedThread = require("../../../Domains/threads/entities/PostedThread");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist adding thread", async () => {
      const owner_id = "user-123";
      const addThread = new NewThread({
        title: "title",
        body: "123456",
        owner: owner_id,
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgres.addThread(addThread);
      const thread = await ThreadsTableTestHelper.getThreadById("thread-123");
      expect(thread).toHaveLength(1);
    });

    it("should return registered thread correctly", async () => {
      const owner_id = "user-123";
      const addThread = new NewThread({
        title: "title",
        body: "123456",
        owner: owner_id,
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const newThread = await threadRepositoryPostgres.addThread(addThread);

      expect(newThread).toStrictEqual(
        new PostedThread({
          id: "thread-123",
          title: "title",
          owner: "user-123",
        })
      );
    });
  });

  describe("getThreadById function", () => {
    it("it should return notFound error when thread id does not exist", async () => {
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThreadById("thread-124")
      ).rejects.toThrowError(NotFoundError);
    });
    it("it should return notFound error when thread id does not exist", async () => {
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThreadById("thread-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
