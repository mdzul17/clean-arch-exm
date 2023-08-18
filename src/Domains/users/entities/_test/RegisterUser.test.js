const RegisterUser = require("../RegisterUser");

describe("RegisterUser", () => {
  it("should throw an error when payload did not contain needed payload", () => {
    const payload = {
      username: "abc",
      password: "abc",
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      username: 123,
      fullname: true,
      password: "abc",
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when username contains more than 50 characters", () => {
    const payload = {
      username: "dicodingindonesiadicodingindonesiadicodingindonesiadicoding",
      fullname: "dicoding indonesia",
      password: "abc",
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.USERNAME_LIMIT_CHAR"
    );
  });

  it("should throw error when username contains restricted charater", () => {
    const payload = {
      username: "dico ding",
      fullname: "dicoding",
      password: "abc",
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER"
    );
  });

  it("should create registerUser object correctly", () => {
    const payload = {
      username: "dicoding",
      fullname: "dicoding indonesia",
      password: "abc",
    };

    const { username, fullname, password } = new RegisterUser(payload);

    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
