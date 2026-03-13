const { app, request } = require("./setup");

describe("Authentication Middleware", () => {
    const protectedRoutes = [
        { method: "get", path: "/profil" },
        { method: "get", path: "/potongan" },
        { method: "get", path: "/pendapatan" },
        { method: "get", path: "/golongan" },
        { method: "get", path: "/jabatan" },
    ];

    protectedRoutes.forEach(({ method, path }) => {
        it(`should return 401 for ${method.toUpperCase()} ${path} without token`, async () => {
            const res = await request(app)[method](path);
            expect(res.status).toBe(401);
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].msg).toBe("Token dibutuhkan untuk otentikasi");
        });
    });

    it("should return 401 with invalid token", async () => {
        const res = await request(app)
            .get("/profil")
            .set("Authorization", "invalid.token.here");
        expect(res.status).toBe(401);
        expect(res.body.errors[0].msg).toBe("Token tidak valid");
    });
});
