const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(req, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const { threadId, commentId } = req.params;
    const { id } = req.auth.credentials;

    const reply = await addReplyUseCase.execute(id, {
      ...req.payload,
      thread_id: threadId,
      comment_id: commentId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedReply: reply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteReplyHandler(req, h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );

    const { threadId, commentId, replyId } = req.params;
    const { id } = req.auth.credentials;

    await deleteReplyUseCase.execute(id, {
      thread_id: threadId,
      comment_id: commentId,
      id: replyId,
    });

    const response = h.response({
      status: "success",
    });

    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
