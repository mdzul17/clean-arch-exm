class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.owner = payload.owner;
    this.thread_id = payload.thread_id;
  }

  _verifyPayload(payload) {
    if (!payload.content || !payload.owner || !payload.thread_id) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof payload.content != "string" ||
      typeof payload.owner != "string" ||
      typeof payload.thread_id != "string"
    ) {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddComment;
