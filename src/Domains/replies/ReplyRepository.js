class ReplyRepository {
  async addReply(payload) {
    throw Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteReply(id) {
    throw Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getReplyById(id) {
    throw Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getReplyByThreadId(id) {
    throw Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyOwner(id, owner) {
    throw Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyAvailability(id) {
    throw Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReplyRepository;
