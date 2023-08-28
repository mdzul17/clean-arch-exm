const AddComment = require("../../../Domains/comments/entities/AddComment");
const UserRepository = require("../../../Domains/users/UserRepository");
const ThreadsRepository = require("../../../Domains/threads/ThreadsRepository");
const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
const AddCommentUseCase = require("../AddCommentUserCase");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");

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
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "dicoding", id: "user-123" })
      );
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
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const addComment = await addCommentUseCase.execute("some_access_token", {
      ...useCasePayload,
    });

    expect(addComment).toStrictEqual({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });
    expect(mockUserRepository.getUserById).toBeCalledWith("user-123");
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      "some_access_token"
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        ...useCasePayload,
      })
    );
  });
});
