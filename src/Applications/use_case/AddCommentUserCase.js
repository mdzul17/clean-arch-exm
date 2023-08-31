const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id, useCasePayload) {
    await this._userRepository.getUserById(id);
    await this._threadRepository.getThreadById(useCasePayload.thread_id);

    const addComment = new AddComment({ ...useCasePayload, owner: id });

    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
