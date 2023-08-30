const CommentRepository = require("../CommentRepository");

describe("CommentsRepository", function () {
  it("should throw an error when invoke abstact behavior ", async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.deleteComment).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.getCommentById).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.getCommentsByThreadId).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
