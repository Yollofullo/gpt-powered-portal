export function useErrorHandler() {
  return (error: any) => {
    console.error("🚨 Error:", error);
    alert("Something went wrong.");
  };
}
