class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    if (!payload.title || !payload.content) {
      throw new Error("NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof payload.title != "string" ||
      typeof payload.content != "string"
    ) {
      throw new Error("NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = NewThread;
