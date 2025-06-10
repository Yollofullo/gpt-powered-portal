import { safeFetch } from "../utils/safeFetch";

describe("safeFetch", () => {
  it("should return result and null error on success", async () => {
    const [data, error] = await safeFetch(Promise.resolve("success"));
    expect(data).toBe("success");
    expect(error).toBeNull();
  });

  it("should return null and error on failure", async () => {
    const [data, error] = await safeFetch(Promise.reject("failure"));
    expect(data).toBeNull();
    expect(error).toBe("failure");
  });
});
