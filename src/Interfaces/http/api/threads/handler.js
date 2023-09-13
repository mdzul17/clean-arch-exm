const PostThreadUseCase = require("../../../../Applications/use_case/PostThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
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
}

module.exports = ThreadsHandler;
