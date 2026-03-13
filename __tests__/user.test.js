const { app, request } = require("./setup");

describe("User Module", () => {
    describe("POST /user/register", () => {
        it("should return 400 when body is empty", async () => {
            const res = await request(app).post("/user/register").send({});
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it("should return 400 when email is invalid", async () => {
            const res = await request(app).post("/user/register").send({
                ID_User: "USR001",
                NamaDepan: "John",
                NamaBelakang: "Doe",
                Status: "Aktif",
                email: "not-an-email",
                password: "Test@1234",
            });
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it("should return 400 when password is too weak", async () => {
            const res = await request(app).post("/user/register").send({
                ID_User: "USR001",
                NamaDepan: "John",
                NamaBelakang: "Doe",
                Status: "Aktif",
                email: "john@test.com",
                password: "weak",
            });
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it("should return 400 when password has no uppercase", async () => {
            const res = await request(app).post("/user/register").send({
                ID_User: "USR001",
                NamaDepan: "John",
                NamaBelakang: "Doe",
                Status: "Aktif",
                email: "john@test.com",
                password: "test@1234",
            });
            expect(res.status).toBe(400);
            const msgs = res.body.errors.map((e) => e.msg);
            expect(msgs).toContain("Password harus mengandung minimal 1 huruf besar.");
        });

        it("should return 400 when password has no special char", async () => {
            const res = await request(app).post("/user/register").send({
                ID_User: "USR001",
                NamaDepan: "John",
                NamaBelakang: "Doe",
                Status: "Aktif",
                email: "john@test.com",
                password: "Test12345",
            });
            expect(res.status).toBe(400);
            const msgs = res.body.errors.map((e) => e.msg);
            expect(msgs).toContain("Password harus mengandung minimal 1 karakter spesial.");
        });
    });

    describe("POST /user/login", () => {
        it("should return 400 when body is empty", async () => {
            const res = await request(app).post("/user/login").send({});
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it("should return 400 when email is invalid", async () => {
            const res = await request(app).post("/user/login").send({
                email: "not-an-email",
                password: "Test@1234",
            });
            expect(res.status).toBe(400);
        });
    });
});
