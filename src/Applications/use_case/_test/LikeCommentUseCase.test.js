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
    mockCommentRepository.getLikes = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));
    mockCommentRepository.likeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await likeCommentUseCase.execute("user-123", {
      ...useCasePayload,
    });

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      "comment-123"
    );
    expect(mockCommentRepository.getLikes).toBeCalledWith(
      useCasePayload.thread_id
    );

    expect(mockCommentRepository.likeComment).toHaveBeenCalledWith(
      "user-123",
      useCasePayload.thread_id,
      useCasePayload.comment_id
    );
  });

  it("should orchestrating the unlike comment action correctly if the comment already liked", async () => {
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
    mockCommentRepository.getLikes = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          user_id: "user-123",
          thread_id: "thread-123",
          comment_id: "comment-123",
        },
      ])
    );
    mockCommentRepository.unlikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await likeCommentUseCase.execute("user-123", {
      ...useCasePayload,
    });

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      "comment-123"
    );
    expect(mockCommentRepository.getLikes).toBeCalledWith(
      useCasePayload.thread_id
    );

    expect(mockCommentRepository.unlikeComment).toHaveBeenCalledWith(
      "user-123",
      useCasePayload.thread_id,
      useCasePayload.comment_id
    );
  });
});
