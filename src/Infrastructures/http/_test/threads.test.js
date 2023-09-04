const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");

describe("/threads endpoint", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads", () => {
    it("should response 201 and new thread", async () => {
      const requestPayload = {
        title: "some title",
        body: "some body",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const resToken = JSON.parse(token.payload);
      const { accessToken } = resToken.data;

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });
    it("should response 400 if body request is not valid", async () => {
      const requestPayload = {
        title: "some title",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const resToken = JSON.parse(token.payload);
      const { accessToken } = resToken.data;

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "harus mengirimkan judul, isi, dan owner"
      );
    });
  });

  describe("when POST /threads/{threadId}/comments}", () => {
    it("should response 201 and new comments", async () => {
      const requestPayload = {
        content: "some content",
      };

      const threadPayload = {
        title: "some title",
        body: "some body",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const resToken = JSON.parse(token.payload);
      const { accessToken } = resToken.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const response = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
    it("should response 404 when thread is not valid or unavailable", async () => {
      const requestPayload = {
        content: "some content",
      };

      const threadPayload = {
        title: "some title",
        body: "some body",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const resToken = JSON.parse(token.payload);
      const { accessToken } = resToken.data;

      await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Thread tidak ditemukan!");
    });
    it("should response 400 when body request is not valid", async () => {
      const requestPayload = {
        content: 123,
      };

      const threadPayload = {
        title: "some title",
        body: "some body",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const resToken = JSON.parse(token.payload);
      const { accessToken } = resToken.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const response = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "konten, owner, dan thread id harus berupa string"
      );
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should successfully delete comment", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const tokenRes = JSON.parse(token.payload);
      const { accessToken } = tokenRes.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "some title",
          body: "some body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${id}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
    it("should response 403 when the users is not comment owner", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "alpha",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const tokenRes = JSON.parse(token.payload);
      const { accessToken } = tokenRes.data;

      const tokenAlpha = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "alpha",
          password: "secret",
        },
      });

      const tokenResAlpha = JSON.parse(tokenAlpha.payload);
      const { accessToken: accessTokenAlpha } = tokenResAlpha.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "some title",
          body: "some body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${id}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenAlpha}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "Anda tidak berhak mengakses resource ini"
      );
    });
    it("should response 404 when the thread or comment is not valid or unavailable", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "alpha",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const tokenRes = JSON.parse(token.payload);
      const { accessToken } = tokenRes.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "some title",
          body: "some body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${id}/comments/comment-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Comment tidak ditemukan");
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 200 and return thread detail", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "alpha",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const tokenRes = JSON.parse(token.payload);
      const { accessToken } = tokenRes.data;

      const tokenAlpha = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "alpha",
          password: "secret",
        },
      });

      const tokenResAlpha = JSON.parse(tokenAlpha.payload);
      const { accessToken: accessTokenAlpha } = tokenResAlpha.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "some title",
          body: "some body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const commentAlpha = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content by alpha",
        },
        headers: {
          Authorization: `Bearer ${accessTokenAlpha}`,
        },
      });

      const commentResAlpha = JSON.parse(commentAlpha.payload);
      const { id: commentAlphaId } = commentResAlpha.data.addedComment;

      const response = await server.inject({
        method: "GET",
        url: `/threads/${id}`,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].username).toEqual("dicoding");
    });
    it("should response 200 and change value of comment content when comment is deleted", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "alpha",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const tokenRes = JSON.parse(token.payload);
      const { accessToken } = tokenRes.data;

      const tokenAlpha = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "alpha",
          password: "secret",
        },
      });

      const tokenResAlpha = JSON.parse(tokenAlpha.payload);
      const { accessToken: accessTokenAlpha } = tokenResAlpha.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "some title",
          body: "some body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const commentAlpha = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content by alpha",
        },
        headers: {
          Authorization: `Bearer ${accessTokenAlpha}`,
        },
      });

      const commentResAlpha = JSON.parse(commentAlpha.payload);
      const { id: commentAlphaId } = commentResAlpha.data.addedComment;

      await server.inject({
        method: "DELETE",
        url: `/threads/${id}/comments/${commentAlphaId}`,
        headers: {
          Authorization: `Bearer ${accessTokenAlpha}`,
        },
      });

      const response = await server.inject({
        method: "GET",
        url: `/threads/${id}`,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[1].content).toEqual(
        "**komentar telah dihapus**"
      );
    });
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 201 and new reply", async () => {
      const requestPayload = {
        content: "some content reply",
      };

      const threadPayload = {
        title: "some title",
        body: "some body",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const resToken = JSON.parse(token.payload);
      const { accessToken } = resToken.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const response = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });
    it("should response 404 when thread or comment is not valid or unavailable", async () => {
      const requestPayload = {
        content: "some content",
      };

      const threadPayload = {
        title: "some title",
        body: "some body",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const resToken = JSON.parse(token.payload);
      const { accessToken } = resToken.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resThread = JSON.parse(thread.payload);
      const { id: threadId } = resThread.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "some comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Thread tidak ditemukan!");
    });
    it("should response 400 when body request is not valid", async () => {
      const requestPayload = {
        content: 123,
      };

      const threadPayload = {
        title: "some title",
        body: "some body",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const resToken = JSON.parse(token.payload);
      const { accessToken } = resToken.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some comment",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const response = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "konten, owner, thread dan comment id harus berupa string"
      );
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should successfully delete comment", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const tokenRes = JSON.parse(token.payload);
      const { accessToken } = tokenRes.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "some title",
          body: "some body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const reply = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments/${commentId}/replies`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const replyRes = JSON.parse(reply.payload);
      const { id: replyId } = replyRes.data.addedReply;

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${id}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
    it("should response 403 when the users is not reply owner", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "alpha",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const tokenRes = JSON.parse(token.payload);
      const { accessToken } = tokenRes.data;

      const tokenAlpha = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "alpha",
          password: "secret",
        },
      });

      const tokenResAlpha = JSON.parse(tokenAlpha.payload);
      const { accessToken: accessTokenAlpha } = tokenResAlpha.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "some title",
          body: "some body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const reply = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments/${commentId}/replies`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const replyRes = JSON.parse(reply.payload);
      const { id: replyId } = replyRes.data.addedReply;

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${id}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenAlpha}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "Anda tidak berhak mengakses resource ini"
      );
    });
    it("should response 404 when the thread, comment, reply is not valid or unavailable", async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "alpha",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const token = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const tokenRes = JSON.parse(token.payload);
      const { accessToken } = tokenRes.data;

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "some title",
          body: "some body",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadRes = JSON.parse(thread.payload);
      const { id } = threadRes.data.addedThread;

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentRes = JSON.parse(comment.payload);
      const { id: commentId } = commentRes.data.addedComment;

      const reply = await server.inject({
        method: "POST",
        url: `/threads/${id}/comments/${commentId}/replies`,
        payload: {
          content: "some content",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const replyRes = JSON.parse(reply.payload);
      const { id: replyId } = replyRes.data.addedReply;

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${id}/comments/${commentId}/replies/xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Reply tidak ditemukan");
    });
  });
});
