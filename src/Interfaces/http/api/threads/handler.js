const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUserCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const PostThreadUseCase = require("../../../../Applications/use_case/PostThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(req, h) {
    const postThreadUseCase = this._container.getInstance(
      PostThreadUseCase.name
    );

    const thread = await postThreadUseCase.execute(
      req.auth.credentials,
      req.payload
    );

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

    const { threadId } = request.params;

    const comment = await addCommentUseCase.execute(req.auth.credentials, {
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

    const { threadId, commentId } = request.params;

    deleteCommentUseCase.execute(req.auth.credentials, {
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
        thread,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
