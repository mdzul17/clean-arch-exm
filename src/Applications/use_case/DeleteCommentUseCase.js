class DeleteCommentUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    authenticationTokenManager,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(id, useCasePayload) {
    const { username, id: user_id } =
      await this._authenticationTokenManager.decodePayload(id);
    await this._userRepository.getUserById(user_id);
    await this._threadRepository.getThreadById(useCasePayload.thread_id);

    return this._commentRepository.deleteComment(useCasePayload.id);
  }
}

module.exports = DeleteCommentUseCase;
