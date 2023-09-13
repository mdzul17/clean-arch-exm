const NewThread = require("../../../Domains/threads/entities/NewThread");
const PostedThread = require("../../../Domains/threads/entities/PostedThread");
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

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedThread));

    const postThreadUseCase = new PostThreadUseCase({
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

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        ...useCasePayload,
        owner: "user-123",
      })
    );
  });
});
