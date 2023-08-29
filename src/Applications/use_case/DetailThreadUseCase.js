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

    comments.forEach((element) => {
      element.is_delete == 0
        ? (element.content = "**komentar telah dihapus**")
        : element.content;
      delete element.is_delete;
    });

    return { thread: { ...thread, comments: comments } };
  }
}

module.exports = DetailThreadUseCase;
