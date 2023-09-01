const AddReply = require("../../../Domains/replies/entities/AddReply");
const UserRepository = require("../../../Domains/users/UserRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    const useCasePayload = {
      content: "test content",
      thread_id: "thread-123",
      comment_id: "comment-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockReplyRepository = new ReplyRepository();

    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: "reply-123",
        content: useCasePayload.content,
        owner: "user-123",
      })
    );

    const addReplyUseCase = new AddReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addReply = await addReplyUseCase.execute("user-123", {
      ...useCasePayload,
    });

    expect(addReply).toStrictEqual({
      id: "reply-123",
      content: useCasePayload.content,
      owner: "user-123",
    });
    expect(mockUserRepository.getUserById).toBeCalledWith("user-123");
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getCommentById).toBeCalledWith("comment-123");
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        ...useCasePayload,
        owner: "user-123",
      })
    );
  });
});
