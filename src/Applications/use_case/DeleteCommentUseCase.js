class DeleteCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id, useCasePayload) {
    await this._userRepository.getUserById(id);
    await this._threadRepository.getThreadById(useCasePayload.thread_id);
    await this._commentRepository.verifyCommentOwner(useCasePayload.id, id);

    return this._commentRepository.deleteComment(useCasePayload.id);
  }
}

module.exports = DeleteCommentUseCase;
