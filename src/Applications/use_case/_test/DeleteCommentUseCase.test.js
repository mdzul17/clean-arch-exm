const UserRepository = require("../../../Domains/users/UserRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    const useCasePayload = {
      owner: "user-123",
      id: "comment-123",
      thread_id: "thread-123",
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
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
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    await deleteCommentUseCase.execute("some_access_token", {
      ...useCasePayload,
    });

    expect(mockUserRepository.getUserById).toBeCalledWith("user-123");
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      "some_access_token"
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.id
    );
  });
});
