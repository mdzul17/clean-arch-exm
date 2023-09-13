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

    let replies = await this._replyRepository.getReplyByThreadId(
      useCasePayload.id
    );

    comments = comments.map((comment) => {
      comment.replies = replies.filter(
        (reply) => reply.comment_id == comment.id
      );

      comment.replies.forEach((element) => {
        if (element.is_delete == 1)
          element.content = "**balasan telah dihapus**";
        delete element.is_delete;
        delete element.comment_id;
      });

      if (comment.is_delete == 1)
        comment.content = "**komentar telah dihapus**";
      delete comment.is_delete;
      return comment;
    });

    return { thread: { ...thread, comments: comments } };
  }
}

module.exports = DetailThreadUseCase;
