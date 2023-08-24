const AuthenticationRepository = require("../AuthenticationRepository");

describe("AuthenticationRepository", () => {
  it("should throw an error when invoke abstract behavior", async () => {
    const authenticationRepository = new AuthenticationRepository();

    await expect(authenticationRepository.addToken({})).rejects.toThrowError(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      authenticationRepository.checkAvailabilityToken({})
    ).rejects.toThrowError("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(authenticationRepository.deleteToken({})).rejects.toThrowError(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
