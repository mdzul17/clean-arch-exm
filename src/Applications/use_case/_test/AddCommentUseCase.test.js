const AddComment = require("../../../Domains/comments/entities/AddComment");
const UserRepository = require("../../../Domains/users/UserRepository");
const ThreadsRepository = require("../../../Domains/threads/ThreadsRepository");
const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
const AddCommentUseCase = require("../AddCommentUserCase");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    const useCasePayload = {
      content: "test content",
      owner: "user-123",
      thread_id: "thread-123",
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadsRepository();
    const mockCommentRepository = new CommentsRepository();

    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
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
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addComment = await addCommentUseCase.execute(useCasePayload);

    console.log(addComment);

    expect(addComment).toStrictEqual({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });
    expect(mockUserRepository.getUserById).toBeCalledWith("user-123");
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        ...useCasePayload,
      })
    );
  });
});
