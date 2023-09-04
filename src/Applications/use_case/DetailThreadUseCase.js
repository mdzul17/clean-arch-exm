class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(
      useCasePayload.id
    );
    let comments = await this._commentRepository.getCommentsByThreadId(
      useCasePayload.id
    );

    const replies = await this._replyRepository.getReplyByThreadId(
      useCasePayload.id
    );

    comments = comments.map((comment) => {
      comment.replies = replies.filter(
        (reply) => reply.comment_id == comment.id
      );
      if (comment.replies.length > 0) delete comment.replies[0].comment_id;
      return comment;
    });

    return { thread: { ...thread, comments: comments } };
  }
}

module.exports = DetailThreadUseCase;
