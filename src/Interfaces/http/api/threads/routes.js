const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "threadapp_jwt",
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentHandler,
    options: {
      auth: "threadapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentHandler,
    options: {
      auth: "threadapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getDetailThreadHandler,
  },
];
