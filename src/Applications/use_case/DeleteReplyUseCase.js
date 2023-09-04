class DeleteReplyUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(id, useCasePayload) {
    await this._userRepository.getUserById(id);
    await this._threadRepository.getThreadById(useCasePayload.thread_id);
    await this._commentRepository.getCommentById(useCasePayload.comment_id);
    await this._replyRepository.verifyReplyOwner(useCasePayload.id, id);

    return this._replyRepository.deleteReply(useCasePayload.id);
  }
}

module.exports = DeleteReplyUseCase;
