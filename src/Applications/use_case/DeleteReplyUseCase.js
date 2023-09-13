class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(id, useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(
      useCasePayload.thread_id
    );
    await this._commentRepository.verifyCommentAvailability(
      useCasePayload.comment_id
    );
    await this._replyRepository.verifyReplyOwner(useCasePayload.id, id);

    return this._replyRepository.deleteReply(useCasePayload.id);
  }
}

module.exports = DeleteReplyUseCase;
