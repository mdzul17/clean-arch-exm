const NewThread = require("../../Domains/threads/entities/NewThread");

class PostThreadUseCase {
  constructor({ userRepository, threadRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(id, useCasePayload) {
    await this._userRepository.getUserById(id);
    const newThread = new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: id,
    });

    return this._threadRepository.addThread(newThread);
  }
}
module.exports = PostThreadUseCase;
