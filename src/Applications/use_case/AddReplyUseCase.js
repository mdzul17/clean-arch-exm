const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(id, payload) {
    await this._threadRepository.verifyThreadAvailability(payload.thread_id);
    await this._commentRepository.verifyCommentAvailability(payload.comment_id);

    const addReply = new AddReply({ ...payload, owner: id });

    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
