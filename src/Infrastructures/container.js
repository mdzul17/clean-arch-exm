/* istanbul ignore file */

const { createContainer } = require("instances-container");

const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const pool = require("./database/postgres/pool");
const Jwt = require("@hapi/jwt");

const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const UserRepository = require("../Domains/users/UserRepository");
const PasswordHash = require("../Applications/security/PasswordHash");

const AuthenticationTokenManager = require("../Applications/security/AuthenticationTokenManager");
const JwtTokenManager = require("./security/JwtTokenManager");
const LoginUserUseCase = require("../Applications/use_case/LoginUserUseCase");
const AuthenticationRepositoryPostgres = require("./repository/AuthenticationRepositoryPostgres");
const LogoutUserUseCase = require("../Applications/use_case/LogoutUserUseCase");
const RefreshAuthenticationUseCase = require("../Applications/use_case/RefreshAuthenticationUseCase");
const AuthenticationRepository = require("../Domains/authentications/AuthenticationRepository");

const ThreadRepository = require("../Domains/threads/ThreadRepository");
const ThreadRepositoryPostgres = require("../Infrastructures/repository/ThreadRepositoryPostgres");
const PostThreadUseCase = require("../Applications/use_case/PostThreadUseCase");
const DetailThreadUseCase = require("../Applications/use_case/DetailThreadUseCase");

const CommentRepository = require("../Domains/comments/CommentRepository");
const AddCommentUseCase = require("../Applications/use_case/AddCommentUserCase");
const DeleteCommentUseCase = require("../Applications/use_case/DeleteCommentUseCase");
const CommentRepositoryPostgres = require("../Infrastructures/repository/CommentRepositoryPostgres");

const ReplyRepository = require("../Domains/replies/ReplyRepository");
const AddReplyUseCase = require("../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../Applications/use_case/DeleteReplyUseCase");
const ReplyRepositoryPostgres = require("../Infrastructures/repository/ReplyRepositoryPostgres");

const container = createContainer();

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
]);

container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: PostThreadUseCase.name,
    Class: PostThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: DetailThreadUseCase.name,
    Class: DetailThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
