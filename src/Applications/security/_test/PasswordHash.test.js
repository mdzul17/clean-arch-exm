const PasswordHash = require("../PasswordHash");

describe("PasswordHash", () => {
  it("should throw error when invoke abstract behaviour", async () => {
    const passwordHash = new PasswordHash();

    await expect(passwordHash.hash("dummy_password")).rejects.toThrowError(
      "PASSWORD_HASH.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      passwordHash.comparePassword("plain", "encrypted")
    ).rejects.toThrowError("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED");
  });
});
