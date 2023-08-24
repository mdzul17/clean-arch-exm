const PostedThread = require("../PostedThread");

describe("PostedThread entities", () => {
  it("should throw an error when payload did not contain needed properties", () => {
    const payload = {
      title: "title",
      content: "123456",
    };

    expect(() => new PostedThread(payload)).toThrowError(
      "POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      title: "title",
      content: "123456",
    };

    expect(() => new PostedThread(payload)).toThrowError(
      "POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create postedThread object correctly", () => {
    const payload = {
      id: "thread-123",
      title: "title",
      content: "123456",
    };

    const postedThread = new PostedThread(payload);

    expect(postedThread.id).toEqual(payload.id);
    expect(postedThread.title).toEqual(payload.title);
    expect(postedThread.content).toEqual(payload.content);
  });
});
