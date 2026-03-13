const { app, request } = require("./setup");

describe("Potongan Module - Validation", () => {
    // These tests don't need a real DB connection - they test validation only

    describe("POST /potongan", () => {
        it("should return 401 without token", async () => {
            const res = await request(app).post("/potongan").send({
                ID_Potongan: "PTG001",
                Nama_Potongan: "Test",
            });
            expect(res.status).toBe(401);
        });
    });

    describe("GET /potongan/:id", () => {
        it("should return 401 without token", async () => {
            const res = await request(app).get("/potongan/PTG001");
            expect(res.status).toBe(401);
        });
    });

    describe("PUT /potongan/:id", () => {
        it("should return 401 without token", async () => {
            const res = await request(app)
                .put("/potongan/PTG001")
                .send({ Nama_Potongan: "Updated" });
            expect(res.status).toBe(401);
        });
    });

    describe("DELETE /potongan/:id", () => {
        it("should return 401 without token", async () => {
            const res = await request(app).delete("/potongan/PTG001");
            expect(res.status).toBe(401);
        });
    });
});
