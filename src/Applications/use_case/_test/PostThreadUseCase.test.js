const NewThread = require("../../../Domains/threads/entities/NewThread");
const PostedThread = require("../../../Domains/threads/entities/PostedThread");
const UserRepository = require("../../../Domains/users/UserRepository");
const ThreadsRepository = require("../../../Domains/threads/ThreadsRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const PostThreadUseCase = require("../PostThreadUseCase");

describe("PostThreadUseCase", () => {
  it("should orchestrating the post thread action properly", async () => {
    const useCasePayload = {
      title: "title",
      body: "123456",
      owner: "user-123",
    };

    const mockPostedThread = new PostedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadsRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedThread));
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "dicoding", id: "user-123" })
      );

    const postThreadUseCase = new PostThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const postedThread = await postThreadUseCase.execute("some_access_token", {
      ...useCasePayload,
    });

    expect(postedThread).toStrictEqual(
      new PostedThread({
        id: "thread-123",
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      })
    );

    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      "some_access_token"
    );
    expect(mockUserRepository.getUserById).toBeCalledWith("user-123");
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        ...useCasePayload,
      })
    );
  });
});
