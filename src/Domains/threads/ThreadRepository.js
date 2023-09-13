class ThreadRepository {
  async addThread(payload) {
    throw new Error("THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getThreads() {
    throw new Error("THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getThreadById(id) {
    throw new Error("THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyThreadAvailability(id) {
    throw new Error("THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
