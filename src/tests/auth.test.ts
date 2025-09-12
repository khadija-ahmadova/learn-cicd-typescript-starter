import { describe, it, expect } from "vitest";
import { getAPIKey } from "../api/auth.js";

describe("getAPIKey", () => {
  it("returns null if authorization header is missing", () => {
    const headers = {};
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns null if authorization header does not start with ApiKey", () => {
    const headers = { authorization: "Bearer some-token" };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns null if authorization header is malformed (no token)", () => {
    const headers = { authorization: "ApiKey" };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns the API key when authorization header is correctly formatted", () => {
    const headers = { authorization: "ApiKey my-secret-key" };
    expect(getAPIKey(headers)).toBe("my-secret-key");
  });

  it("handles extra spaces gracefully", () => {
    const headers = { authorization: "ApiKey    spaced-key" };
    expect(getAPIKey(headers)).toBe("   spaced-key");
  });

  it("is case-sensitive and should return null if prefix is not exactly 'ApiKey'", () => {
    const headers = { authorization: "apikey wrong-case" };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns only the second part even if more tokens exist", () => {
    const headers = { authorization: "ApiKey key123 extra ignore" };
    expect(getAPIKey(headers)).toBe("key123");
  });
});
