const DetailThreadUseCase = require("../DetailThreadUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("DetailThreadUseCase", () => {
  it("should show deleted comment message while it deleted", async () => {
    const useCasePayload = {
      id: "thread-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: "thread-123",
        title: "thread",
        body: "body thread",
        date: "2021-08-08T07:19:09.775Z",
        username: "anonim",
      })
    );
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: "comment-123",
            username: "dicoding",
            date: "2021-08-08T07:19:09.775Z",
            content: "sebuah comment",
            is_delete: 0,
          },
          {
            id: "comment-124",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            is_delete: 1,
          },
        ])
      );

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    expect(detailThread).toStrictEqual({
      thread: {
        id: "thread-123",
        title: "thread",
        body: "body thread",
        date: "2021-08-08T07:19:09.775Z",
        username: "anonim",
        comments: [
          {
            id: "comment-123",
            username: "dicoding",
            date: "2021-08-08T07:19:09.775Z",
            content: "**komentar telah dihapus**",
          },
          {
            id: "comment-124",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
          },
        ],
      },
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      "thread-123"
    );
  });
});
