class PostedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, owner } = payload;

    this.title = title;
    this.id = id;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload.title || !payload.owner || !payload.id) {
      throw new Error("POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof payload.title != "string" ||
      typeof payload.owner != "string" ||
      typeof payload.id != "string"
    ) {
      throw new Error("POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = PostedThread;
