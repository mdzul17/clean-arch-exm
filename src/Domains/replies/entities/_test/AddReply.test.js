const AddReply = require("../AddReply");

describe("AddReply", () => {
  it("should throw an error when payload did not contain needed properties", () => {
    const payload = {
      content: "test content",
    };

    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload did not meet data type specification", () => {
    const payload = {
      content: "test content",
      owner: 123,
      thread_id: "thread-123",
      comment_id: "comment-123",
    };

    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create a reply object correctly", () => {
    const payload = {
      content: "test content",
      owner: "owner-123",
      thread_id: "thread-123",
      comment_id: "comment-123",
    };

    const addReply = new AddReply(payload);

    expect(addReply.content).toEqual(payload.content);
    expect(addReply.owner).toEqual(payload.owner);
    expect(addReply.thread_id).toEqual(payload.thread_id);
    expect(addReply.comment_id).toEqual(payload.comment_id);
  });
});
