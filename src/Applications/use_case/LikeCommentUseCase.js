class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id, useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(
      useCasePayload.thread_id
    );
    await this._commentRepository.verifyCommentAvailability(
      useCasePayload.comment_id
    );
    const likes = await this._commentRepository.getLikes(
      useCasePayload.thread_id
    );

    const is_liked = likes.filter(
      (like) =>
        like.comment_id == useCasePayload.comment_id &&
        like.user_id == id &&
        like.thread_id == useCasePayload.thread_id
    );

    if (is_liked.length > 0) {
      return await this._commentRepository.unlikeComment(
        id,
        useCasePayload.thread_id,
        useCasePayload.comment_id
      );
    }

    return await this._commentRepository.likeComment(
      id,
      useCasePayload.thread_id,
      useCasePayload.comment_id
    );
  }
}

module.exports = LikeCommentUseCase;
