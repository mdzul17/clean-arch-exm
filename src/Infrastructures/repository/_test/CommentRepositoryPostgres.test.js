const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
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
  });

  describe("addComment function", () => {
    it("should persist adding a comment", async () => {
      const commentPayload = {
        content: "first comment",
        owner: "user-123",
        thread_id: "thread-123",
      };

      const fakeIdGenerator = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await commentRepository.addComment(commentPayload);

      const comment = await CommentsTableTestHelper.getCommentById(
        "comment-123"
      );

      expect(comment).toHaveLength(1);
    });
  });
  describe("getCommentsByThreadId function", () => {
    it("should have length 0 when thread id is not correct or not found", async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      const comment = await commentRepository.getCommentsByThreadId(
        "thread-124"
      );

      expect(comment).toHaveLength(0);
    });

    it("should have length 1 when thread id is correct or available", async () => {
      await CommentsTableTestHelper.addComment({ id: "comment-123" });

      const commentRepository = new CommentRepositoryPostgres(pool, {});
      const comment = await commentRepository.getCommentsByThreadId(
        "thread-123"
      );

      expect(comment).toHaveLength(1);
    });
  });
  describe("deleteComment function", () => {
    it("should throw error when comment is not available", async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepository.deleteComment("comment-123")
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw error when thread id is correct", async () => {
      await CommentsTableTestHelper.addComment({ id: "comment-123" });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepository.deleteComment("comment-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });
  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError when comment owner is not correct", async () => {
      await CommentsTableTestHelper.addComment({ id: "comment-123" });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepository.verifyCommentOwner("comment-123", "user-124")
      ).rejects.toThrow(AuthorizationError);
    });
    it("should not throw error when comment owner is correct", async () => {
      await CommentsTableTestHelper.addComment({ id: "comment-123" });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepository.verifyCommentOwner("comment-123", "user-123")
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
});
