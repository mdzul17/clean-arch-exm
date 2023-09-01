class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.owner = payload.owner;
    this.thread_id = payload.thread_id;
    this.comment_id = payload.comment_id;
  }

  _verifyPayload(payload) {
    if (
      !payload.content ||
      !payload.owner ||
      !payload.thread_id ||
      !payload.comment_id
    ) {
      throw Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof payload.content != "string" ||
      typeof payload.owner != "string" ||
      typeof payload.thread_id != "string" ||
      typeof payload.comment_id != "string"
    ) {
      throw Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddReply;
