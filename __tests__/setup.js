// Set test environment variables before importing app
process.env.TOKEN = "test_jwt_secret_key_for_testing";
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_PORT = process.env.DB_PORT || "3306";
process.env.DB_USER = process.env.DB_USER || "root";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "";
process.env.DB_NAME = process.env.DB_NAME || "payroll_test";
process.env.PAGE_LIMIT = "10";

const request = require("supertest");
const app = require("../app");

/**
 * Helper: Register a test user and get auth token
 */
const getAuthToken = async () => {
    // Try login first
    const loginRes = await request(app)
        .post("/user/login")
        .send({ email: "test@payroll.com", password: "Test@1234" });

    if (loginRes.status === 200 && loginRes.body.token) {
        return loginRes.body.token;
    }

    // If login fails, register first then login
    await request(app).post("/user/register").send({
        ID_User: "USR_TEST",
        NamaDepan: "Test",
        NamaBelakang: "User",
        Status: "Aktif",
        email: "test@payroll.com",
        password: "Test@1234",
    });

    const res = await request(app)
        .post("/user/login")
        .send({ email: "test@payroll.com", password: "Test@1234" });

    return res.body.token;
};

module.exports = { app, request, getAuthToken };
