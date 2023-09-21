const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUserCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const LikeCommentUseCase = require("../../../../Applications/use_case/LikeCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.likeCommentHandler = this.likeCommentHandler.bind(this);
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

  async likeCommentHandler(req, h) {
    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name
    );

    const { threadId, commentId } = req.params;
    const { id } = req.auth.credentials;

    await likeCommentUseCase.execute(id, {
      thread_id: threadId,
      comment_id: commentId,
    });

    const response = h.response({
      status: "success",
    });

    response.code(200);

    return response;
  }
}

module.exports = CommentsHandler;
