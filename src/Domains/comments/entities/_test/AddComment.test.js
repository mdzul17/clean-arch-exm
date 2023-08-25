const AddComment = require("../AddComment");

describe("AddComment", () => {
  it("should throw an error when payload did not contain needed properties", () => {
    const payload = {
      content: "test content",
    };

    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload did not meet data specification", () => {
    const payload = {
      content: "test content",
      owner: 123,
      thread_id: "thread-123",
    };

    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create a comment object correctly", () => {
    const payload = {
      content: "test content",
      owner: "user-123",
      thread_id: "thread-123",
    };

    const addComment = new AddComment(payload);

    expect(addComment.content).toEqual(payload.content);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
