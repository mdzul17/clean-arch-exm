const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeCommentUseCase = require("../LikeCommentUseCase");

describe("LikeCommentUseCase", () => {
  it("should orchestrating the like comment action correctly", async () => {
    const useCasePayload = {
      thread_id: "thread-123",
      comment_id: "comment-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.likeComment = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: "success",
      })
    );

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const likeComment = await likeCommentUseCase.execute("user-123", {
      ...useCasePayload,
    });

    expect(likeComment).toStrictEqual({
      status: "success",
    });
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      "comment-123"
    );
  });
});
