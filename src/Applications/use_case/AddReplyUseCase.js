const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
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

  async execute(id, payload) {
    await this._userRepository.getUserById(id);
    await this._threadRepository.getThreadById(payload.thread_id);
    await this._commentRepository.getCommentById(payload.comment_id);

    const addReply = new AddReply({ ...payload, owner: id });

    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
