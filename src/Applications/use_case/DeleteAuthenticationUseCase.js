class DeleteAuthenticationUseCase {
  constructor({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository;
  }
  async execute(useCasePayload) {
    if (!useCasePayload.refreshToken) {
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    if (typeof useCasePayload.refreshToken != "string") {
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
    await this._authenticationRepository.checkAvailabityToken(
      useCasePayload.refreshToken
    );
    await this._authenticationRepository.deleteToken(
      useCasePayload.refreshToken
    );
  }
}

module.exports = DeleteAuthenticationUseCase;
