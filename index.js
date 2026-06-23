const http = require("http");
const app = require("./app");

module.exports = app;

if (!process.env.VERCEL) {
    const port = process.env.PORT || process.env.API_PORT;
    const server = http.createServer(app);
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
