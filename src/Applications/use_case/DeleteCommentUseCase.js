class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id, useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(
      useCasePayload.thread_id
    );
    await this._commentRepository.verifyCommentOwner(useCasePayload.id, id);

    return this._commentRepository.deleteComment(useCasePayload.id);
  }
}

module.exports = DeleteCommentUseCase;
