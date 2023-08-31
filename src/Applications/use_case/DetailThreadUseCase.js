class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    let comments = await this._commentRepository.getCommentsByThreadId(
      useCasePayload.id
    );
    const thread = await this._threadRepository.getThreadById(
      useCasePayload.id
    );

    return { thread: { ...thread, comments: comments } };
  }
}

module.exports = DetailThreadUseCase;
