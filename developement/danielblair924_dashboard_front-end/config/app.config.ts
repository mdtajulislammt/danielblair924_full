// server base url
export const URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://127.0.0.1:4000";
// app config
export const AppConfig = () => ({
  app: {
    // server endpoint
    url: URL,
    name: "FMC",
    slogan: "app",
    meta: {
      description: "FMC First Mile Club",
      keywords: "app",
    },

    // api endpoint
    apiUrl: `${URL}/api`,
  },
});
