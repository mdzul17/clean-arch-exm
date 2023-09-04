const DetailThreadUseCase = require("../DetailThreadUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("DetailThreadUseCase", () => {
  it("should show deleted comment message while it deleted", async () => {
    const useCasePayload = {
      id: "thread-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

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
            content: "**komentar telah dihapus**",
          },
          {
            id: "comment-124",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
          },
        ])
      );

    mockReplyRepository.getReplyByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: "reply-123",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
          comment_id: "comment-123",
        },
      ])
    );

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
            replies: [
              {
                id: "reply-123",
                username: "johndoe",
                date: "2021-08-08T07:22:33.555Z",
                content: "sebuah comment",
              },
            ],
            content: "**komentar telah dihapus**",
          },
          {
            id: "comment-124",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            replies: [],
          },
        ],
      },
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      "thread-123"
    );
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith("thread-123");
  });
});
