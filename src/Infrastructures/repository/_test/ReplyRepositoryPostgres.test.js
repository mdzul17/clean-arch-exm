const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await ThreadsTableTestHelper.addThread({ id: "thread-123" });
    await CommentsTableTestHelper.addComment({ id: "comment-123" });
  });

  describe("addReply function", () => {
    it("should persist adding a reply", async () => {
      const replyPayload = {
        content: "test content",
        owner: "user-123",
        thread_id: "thread-123",
        comment_id: "comment-123",
      };

      const fakeIdGenerator = () => "123";
      const replyRepository = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await replyRepository.addReply(replyPayload);

      const reply = await RepliesTableTestHelper.getReplyById("reply-123");

      expect(reply).toHaveLength(1);
    });
  });

  describe("deleteReply function", () => {
    it("should throw error when reply is not available", async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepository.deleteReply("reply-123")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should not throw error when thread id is correct", async () => {
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepository.deleteReply("reply-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("getReplyByThreadId", () => {
    it("should have length 0 when thread id is not correct or empty", async () => {
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const reply = await replyRepository.getReplyByThreadId("thread-124");
      expect(reply).toHaveLength(0);
    });
    it("should not throw error when thread id is correct", async () => {
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const reply = await replyRepository.getReplyByThreadId("thread-123");
      expect(reply).toHaveLength(1);
    });
  });

  describe("verifyReplyOwner", () => {
    it("should throw AuthorizationError when comment owner is not correct", async () => {
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepository.verifyReplyOwner("reply-123", "user-124")
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw AuthorizationError when comment owner is correct", async () => {
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepository.verifyReplyOwner("reply-123", "user-123")
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("verifyReplyAvailability function", () => {
    it("should throw NotFoundError when reply is not available", async () => {
      await RepliesTableTestHelper.addReply({ id: "reply-123" });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepository.verifyReplyAvailability("reply-124")
      ).rejects.toThrow(NotFoundError);
    });
    it("should not throw error when reply is available", async () => {
      await RepliesTableTestHelper.addReply({ id: "reply-123" });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepository.verifyReplyAvailability("reply-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
