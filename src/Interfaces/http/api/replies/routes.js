const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postReplyHandler,
    options: {
      auth: "threadapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteReplyHandler,
    options: {
      auth: "threadapp_jwt",
    },
  },
];

module.exports = routes;
