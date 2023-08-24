class AuthenticationRepository {
  async addToken(payload) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async checkAvailabilityToken(payload) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteToken(payload) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = AuthenticationRepository;
