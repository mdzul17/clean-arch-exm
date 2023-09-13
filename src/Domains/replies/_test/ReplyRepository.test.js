const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository", () => {
  it("should throw an error when invoke abstract behavior", async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.addReply).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(replyRepository.deleteReply).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(replyRepository.getReplyById).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(replyRepository.getReplyByThreadId).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(replyRepository.verifyReplyOwner).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.verifyReplyAvailability).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
