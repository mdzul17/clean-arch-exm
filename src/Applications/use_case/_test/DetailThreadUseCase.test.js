const DetailThreadUseCase = require("../DetailThreadUseCase");
const UserRepository = require("../../../Domains/users/UserRepository");
const ThreadsRepository = require("../../../Domains/threads/ThreadsRepository");
const CommentsRepository = require("../../../Domains/comments/CommentsRepository");

describe("DetailThreadUseCase", () => {
  it("should show deleted comment message while it deleted", async () => {
    const threadPayload = {
      id: "thread-123",
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadsRepository();
    const mockCommentRepository = new CommentsRepository();

    mockUserRepository.getUserById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        username: "dicoding",
        id: "user-123",
      })
    );
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: "thread-123",
        title: "thread",
        body: "body thread",
        date: "2021-08-08T07:19:09.775Z",
        owner: "user-123",
      })
    );
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          {
            id: "comment-123",
            owner: "user-124",
            date: "2021-08-08T07:19:09.775Z",
            content: "sebuah comment",
            is_delete: 0,
          },
          {
            id: "comment-123",
            owner: "user-124",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            is_delete: 1,
          }
        )
      );

    const detailThreadUseCase = new DetailThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await detailThreadUseCase.execute(threadPayload);

    expect(detailThread).toStrictEqual();
  });
});
