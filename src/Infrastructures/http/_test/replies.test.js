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
      expect(responseJson.message).toEqual("Thread tidak tersedia");
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
