const NewThread = require("../../Domains/threads/entities/NewThread");

class PostThreadUseCase {
  constructor({
    userRepository,
    threadRepository,
    authenticationTokenManager,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(id, useCasePayload) {
    const { username, id: user_id } =
      await this._authenticationTokenManager.decodePayload(id);
    await this._userRepository.getUserById(user_id);
    const newThread = new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: user_id,
    });

    return this._threadRepository.addThread(newThread);
  }
}
module.exports = PostThreadUseCase;
