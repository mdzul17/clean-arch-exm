const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const PostedThread = require("../../../Domains/threads/entities/PostedThread");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123" });
  });

  describe("addThread function", () => {
    it("should persist adding thread", async () => {
      const addThread = new NewThread({
        title: "title",
        body: "123456",
        owner: "user-123",
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
      const addThread = new NewThread({
        title: "title",
        body: "123456",
        owner: "user-123",
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
    it("it should not return notFound error when thread id does not exist", async () => {
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThreadById("thread-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyThreadAvailability function", () => {
    it("should throw NotFoundError when thread is not available", async () => {
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepository.verifyThreadAvailability("thread-124")
      ).rejects.toThrow(NotFoundError);
    });
    it("should not throw error when thread is available", async () => {
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepository.verifyThreadAvailability("thread-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
