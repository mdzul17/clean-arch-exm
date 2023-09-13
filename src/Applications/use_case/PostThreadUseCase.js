const NewThread = require("../../Domains/threads/entities/NewThread");

class PostThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(id, useCasePayload) {
    const newThread = new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: id,
    });

    return this._threadRepository.addThread(newThread);
  }
}
module.exports = PostThreadUseCase;
