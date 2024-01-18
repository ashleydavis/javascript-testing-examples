const request = require("supertest");
const { createApp } = require("./index");

describe("rest api tests", () => {

    test("can retreive value from rest api", async () => {
        const app = createApp();
        const response = await request(app).get("/an-example-api");
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ message: "Hello World!" });
    });

});