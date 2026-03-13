const { app, request } = require("./setup");

describe("404 Handler", () => {
    it("should return 404 for unknown routes", async () => {
        const res = await request(app).get("/tidak-ada");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Route tidak ditemukan.");
    });

    it("should return 404 for unknown POST routes", async () => {
        const res = await request(app).post("/tidak-ada").send({});
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Route tidak ditemukan.");
    });
});
