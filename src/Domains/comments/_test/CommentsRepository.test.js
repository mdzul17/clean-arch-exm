const CommentsRepository = require("../CommentsRepository");

describe("CommentsRepository", function () {
  it("should throw an error when invoke abstact behavior ", async () => {
    const commentRepository = new CommentsRepository();

    await expect(commentRepository.addComment).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.deleteComment).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
