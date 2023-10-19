import app from "../app";
import { database } from "../config/connection.js";
import LogRepository from "../repositories/LogRepository";

describe("logController", () => {
  let newLogId;

  const errors = [
    {
      type: "Type1",
      message: "message1",
      stack: "{stack 1}",
      email: "test@getLogs1.com",
      domain: "getLogs1",
      date: new Date(1679946943229),
    },
    {
      type: "Type2",
      message: "message2",
      stack: "{stack 2}",
      email: "test@getLogs2.com",
      domain: "getLogs2",
      date: new Date(1689889571194),
    },
    {
      type: "Type3",
      message: "message3",
      stack: "{stack 3}",
      email: "test@getLogs3.com",
      domain: "getLogs3",
      date: new Date(1689997671194),
    },
    {
      type: "Type4",
      message: "message4",
      stack: "{stack 4}",
      email: "test@getLogs2.com",
      domain: "getLogs2",
      date: new Date(1689947590550),
    },
  ];

  beforeAll(async () => {
    for (let i = 0; i < errors.length; i++) {
      const log = await LogRepository.createLog({
        email: errors[i].email,
        domain: errors[i].domain,
        type: errors[i].type,
        message: errors[i].message,
        stack: errors[i].stack,
        createdat: errors[i].date,
      });

      errors[i].id = log[0].id;
    }
  });

  afterAll(async () => {
    if (newLogId) {
      const log = await LogRepository.findById(newLogId);
      if (log.length > 0) await LogRepository.deleteLogById(log[0].id);
    }

    for (let i = 0; i < errors.length; i++) {
      await LogRepository.deleteLogById(errors[i].id);
    }

    database.destroy();
  });

  describe("postLog", () => {
    describe("Route mandatory fields", () => {
      it("should return a 400 because no payload", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/log",
          headers: {
            "Content-Type": "application/json",
          },
          payload: {},
        });

        const body = JSON.parse(response.body);
        expect(response.statusCode).toBe(400);
        expect(body.message).toEqual("body must have required property 'type'");
      });

      it("should return a 400 because no message", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/log",
          headers: {
            "Content-Type": "application/json",
          },
          payload: {
            type: "",
          },
        });

        const body = JSON.parse(response.body);
        expect(response.statusCode).toBe(400);
        expect(body.message).toEqual(
          "body must have required property 'message'",
        );
      });

      it("should return a 400 because no stack", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/log",
          headers: {
            "Content-Type": "application/json",
          },
          payload: {
            type: "",
            message: "",
          },
        });

        const body = JSON.parse(response.body);
        expect(response.statusCode).toBe(400);
        expect(body.message).toEqual(
          "body must have required property 'stack'",
        );
      });

      it("should return a 400 because no email", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/log",
          headers: {
            "Content-Type": "application/json",
          },
          payload: {
            type: "",
            message: "",
            stack: "",
          },
        });

        const body = JSON.parse(response.body);
        expect(response.statusCode).toBe(400);
        expect(body.message).toEqual(
          "body must have required property 'email'",
        );
      });
    });

    describe("Route errors", () => {
      it("should return a 406 because no payload", async () => {
        const data = {
          type: "",
          message: "",
          stack: "",
          email: "",
        };
        const response = await app.inject({
          method: "POST",
          url: "/log",
          headers: {
            "Content-Type": "application/json",
          },
          payload: JSON.stringify(data),
        });

        const body = JSON.parse(response.body);
        expect(response.statusCode).toBe(406);
        expect(body.message).toEqual("Body fields can't be empty");
        expect(body.data).toBeNull();
      });

      it("should return a 422 because email is not valid", async () => {
        const data = {
          type: "type",
          message: "message",
          stack: "stack",
          email: "{ errorMail: {} }",
        };
        const response = await app.inject({
          method: "POST",
          url: "/log",
          headers: {
            "Content-Type": "application/json",
          },
          payload: JSON.stringify(data),
        });

        const body = JSON.parse(response.body);
        expect(response.statusCode).toBe(422);
        expect(body.message).toEqual("Email adress is invalid");
        expect(body.data).toBeNull();
      });
    });

    describe("Route success", () => {
      it("should succeed", async () => {
        const data = {
          type: "type",
          message: "message",
          stack: "stack",
          email: "test@postLog.com",
        };

        const response = await app.inject({
          method: "POST",
          url: "/log",
          headers: {
            "Content-Type": "application/json",
          },
          payload: JSON.stringify(data),
        });

        const body = JSON.parse(response.body);
        expect(response.statusCode).toBe(201);
        expect(body.message).toEqual("log added");
        expect(body.data[0].id).toBeDefined();
        expect(body.data[0].type).toBe(data.type);
        expect(body.data[0].message).toBe(data.message);
        expect(body.data[0].stack).toBe(data.stack);
        expect(body.data[0].email).toBe(data.email);

        newLogId = body.data[0].id;
      });
    });
  });

  describe("getLog", () => {
    // describe("Route success", () => {
    //   it("should succeed", async () => {
    //     const response = await app.inject({
    //       method: "GET",
    //       url: "/log",
    //     });
    //     const body = JSON.parse(response.body);
    //     expect(response.statusCode).toBe(200);
    //     expect(body.message).toEqual("logs");
    //     expect(Array.isArray(body.data.logs)).toBeTruthy();
    //     expect(body.data.params.email).toBeNull();
    //     expect(body.data.params.domain).toBeNull();
    //     expect(body.data.pagination.total).toBeGreaterThan(0);
    //     expect(body.data.pagination.per_page).toBe(25);
    //     expect(body.data.pagination.last_page).toBeGreaterThan(0);
    //     expect(body.data.pagination.current_page).toBe(1);
    //   });
    //   it("should succeed with email in params", async () => {
    //     const query = {
    //       email: errors[0].email,
    //     };
    //     const response = await app.inject({
    //       method: "GET",
    //       url: "/log",
    //       query,
    //     });
    //     const body = JSON.parse(response.body);
    //     expect(response.statusCode).toBe(200);
    //     expect(body.message).toEqual("logs");
    //     expect(Array.isArray(body.data.logs)).toBeTruthy();
    //     expect(body.data.logs.length).toBe(1);
    //     expect(body.data.logs[0].email).toBe(errors[0].email);
    //     expect(body.data.params.email).toBe(query.email);
    //     expect(body.data.params.domain).toBeNull();
    //     expect(body.data.pagination.total).toBe(1);
    //     expect(body.data.pagination.per_page).toBe(25);
    //     expect(body.data.pagination.last_page).toBe(1);
    //     expect(body.data.pagination.current_page).toBe(1);
    //   });
    //   it("should succeed with domain in params", async () => {
    //     const query = {
    //       domain: errors[0].domain,
    //     };
    //     const response = await app.inject({
    //       method: "GET",
    //       url: "/log",
    //       query,
    //     });
    //     const body = JSON.parse(response.body);
    //     expect(response.statusCode).toBe(200);
    //     expect(body.message).toEqual("logs");
    //     expect(Array.isArray(body.data.logs)).toBeTruthy();
    //     expect(body.data.logs.length).toBe(1);
    //     expect(body.data.logs[0].domain).toBe(errors[0].domain);
    //     expect(body.data.params.email).toBeNull();
    //     expect(body.data.params.domain).toBe(query.domain);
    //     expect(body.data.pagination.total).toBe(1);
    //     expect(body.data.pagination.per_page).toBe(25);
    //     expect(body.data.pagination.last_page).toBe(1);
    //     expect(body.data.pagination.current_page).toBe(1);
    //   });
    //   it("should succeed to return no log", async () => {
    //     const query = {
    //       email: errors[0].email,
    //       domain: errors[2].domain,
    //     };
    //     const response = await app.inject({
    //       method: "GET",
    //       url: "/log",
    //       query,
    //     });
    //     const body = JSON.parse(response.body);
    //     expect(response.statusCode).toBe(200);
    //     expect(body.message).toEqual("logs");
    //     expect(Array.isArray(body.data.logs)).toBeTruthy();
    //     expect(body.data.logs.length).toBe(0);
    //     expect(body.data.params.email).toBe(query.email);
    //     expect(body.data.params.domain).toBe(query.domain);
    //     expect(body.data.pagination.total).toBe(0);
    //     expect(body.data.pagination.per_page).toBe(25);
    //     expect(body.data.pagination.last_page).toBe(1);
    //     expect(body.data.pagination.current_page).toBe(1);
    //   });
    // });
  });
});
