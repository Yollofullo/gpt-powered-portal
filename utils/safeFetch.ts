export async function safeFetch<T>(promise: Promise<T>): Promise<[T | null, unknown]> {
  try {
    const data: T = await promise;
    return [data, null];
  } catch (error) {
    console.error("safeFetch error:", error);
    return [null, error];
  }
}
