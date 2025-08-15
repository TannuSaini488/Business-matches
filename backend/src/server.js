const app = require("./app");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("API key loaded?", !!process.env.GEMINI_API_KEY);
  console.log(`Server running on port ${PORT}`);
});
