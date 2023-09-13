const AddComment = require("../../../Domains/comments/entities/AddComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddCommentUseCase = require("../AddCommentUserCase");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    const useCasePayload = {
      content: "test content",
      thread_id: "thread-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: "comment-123",
        content: "test content",
        owner: "user-123",
      })
    );

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addComment = await addCommentUseCase.execute("user-123", {
      ...useCasePayload,
    });

    expect(addComment).toStrictEqual({
      id: "comment-123",
      content: useCasePayload.content,
      owner: "user-123",
    });
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        ...useCasePayload,
        owner: "user-123",
      })
    );
  });
});
