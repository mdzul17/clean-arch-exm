const ThreadsRepository = require("../ThreadsRepository");

describe("ThreadsRepository", () => {
  it("should throw an error when invoke abstract behavior", async () => {
    const threadsRepository = new ThreadsRepository();

    await expect(threadsRepository.addThread()).rejects.toThrowError(
      "THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadsRepository.getThreads()).rejects.toThrowError(
      "THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadsRepository.getThreadById()).rejects.toThrowError(
      "THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
