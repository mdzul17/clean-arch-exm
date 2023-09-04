const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUserCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const PostThreadUseCase = require("../../../../Applications/use_case/PostThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");
const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postThreadHandler(req, h) {
    const postThreadUseCase = this._container.getInstance(
      PostThreadUseCase.name
    );
    const { id } = req.auth.credentials;
    const thread = await postThreadUseCase.execute(id, req.payload);

    const response = h.response({
      status: "success",
      data: {
        addedThread: thread,
      },
    });

    response.code(201);
    return response;
  }

  async postCommentHandler(req, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );

    const { threadId } = req.params;
    const { id } = req.auth.credentials;

    const comment = await addCommentUseCase.execute(id, {
      ...req.payload,
      thread_id: threadId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedComment: comment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentHandler(req, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    const { threadId, commentId } = req.params;
    const { id } = req.auth.credentials;

    await deleteCommentUseCase.execute(id, {
      thread_id: threadId,
      id: commentId,
    });

    const response = h.response({
      status: "success",
    });

    response.code(200);
    return response;
  }

  async getDetailThreadHandler(req, h) {
    const getDetailThreadUseCase = this._container.getInstance(
      DetailThreadUseCase.name
    );

    const { threadId } = req.params;

    const thread = await getDetailThreadUseCase.execute({ id: threadId });

    const response = h.response({
      status: "success",
      data: {
        ...thread,
      },
    });

    response.code(200);
    return response;
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

module.exports = ThreadsHandler;
