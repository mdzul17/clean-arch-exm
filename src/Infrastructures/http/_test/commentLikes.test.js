const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");

describe("/threads endpoint", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 200", async () => {
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
        method: "PUT",
        url: `/threads/${id}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
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
        method: "PUT",
        url: `/threads/thread-123/comments/${commentId}/likes`,
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
  });
});
