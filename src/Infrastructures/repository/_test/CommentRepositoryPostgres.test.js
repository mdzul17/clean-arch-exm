const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    // it("should throw error when thread is not available", async () => {

    //   const fakeIdGenerator = () => "123";
    //   const commentRepository = new CommentRepositoryPostgres(
    //     pool,
    //     fakeIdGenerator,
    //   );

    //   await expect(
    //     commentRepository.addComment(
    //       {
    //         content: "first comment",
    //         owner: "dicoding",
    //         thread_id: "thread",
    //       }
    //     )
    //   ).rejects.toThrow(NotFoundError);
    // });
    // it("should throw error when comment payload is not correct", async () => {
    //   const commentPayload = {
    //     content: "first comment",
    //   };

    //   const fakeIdGenerator = () => "123";
    //   const commentRepository = new CommentRepositoryPostgres(
    //     pool,
    //     fakeIdGenerator,
    //   );

    //   await expect(
    //     commentRepository.addComment(
    //       {
    //         content: "first comment",
    //         owner: "dicoding",
    //       }
    //     )
    //   ).rejects.toThrow(InvariantError);
    // });
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
});
