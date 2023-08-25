const NewThread = require("../../Domains/threads/entities/NewThread");

class PostThreadUseCase {
  constructor({ userRepository, threadRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._userRepository.getUserById(useCasePayload.owner);
    const newThread = new NewThread(useCasePayload);

    return this._threadRepository.addThread(newThread);
  }
}
module.exports = PostThreadUseCase;
