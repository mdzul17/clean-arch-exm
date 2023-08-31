const NewThread = require("../../../Domains/threads/entities/NewThread");
const PostedThread = require("../../../Domains/threads/entities/PostedThread");
const UserRepository = require("../../../Domains/users/UserRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const PostThreadUseCase = require("../PostThreadUseCase");

describe("PostThreadUseCase", () => {
  it("should orchestrating the post thread action properly", async () => {
    const useCasePayload = {
      title: "title",
      body: "contoh thread",
    };

    const mockPostedThread = new PostedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: "user-123",
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();

    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedThread));

    const postThreadUseCase = new PostThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    const postedThread = await postThreadUseCase.execute("user-123", {
      ...useCasePayload,
    });

    expect(postedThread).toStrictEqual(
      new PostedThread({
        id: "thread-123",
        title: useCasePayload.title,
        owner: "user-123",
      })
    );

    expect(mockUserRepository.getUserById).toBeCalledWith("user-123");
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        ...useCasePayload,
        owner: "user-123",
      })
    );
  });
});
