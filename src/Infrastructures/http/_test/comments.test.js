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
});
