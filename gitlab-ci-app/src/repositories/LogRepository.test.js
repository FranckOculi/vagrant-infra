import LogRepository from "./LogRepository";
import { database } from "../config/connection.js";

describe("LogRepository", () => {
  let fakeId;

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
    const log = await LogRepository.createLog({
      type: "ReferenceError",
      email: "test@logRepository.com",
      domain: "logRepository",
      message: "message",
      stack: "stack",
      createdat: new Date(),
    });

    if (log[0]?.id) fakeId = log[0]?.id;

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
    if (fakeId) {
      const log = await LogRepository.findById(fakeId);

      if (log[0]?.id) await LogRepository.deleteLogById(log[0]?.id);
    }

    for (let i = 0; i < errors.length; i++) {
      await LogRepository.deleteLogById(errors[i].id);
    }

    database.destroy();
  });

  describe("createLog", () => {
    it("should return an error if database crash", async () => {
      try {
        await LogRepository.createLog();
      } catch (err) {
        expect(err.message).toBe("Unable to create log");
      }
    });

    it("should succeed", async () => {
      const fakeLog = {
        type: "ReferenceError",
        email: "test@logRepository-createLog.com",
        domain: "logRepository-createLog",
        message: "message",
        stack: "stack",
        createdat: new Date(),
      };
      const response = await LogRepository.createLog(fakeLog);

      expect(response[0].email).toBe(fakeLog.email);

      await LogRepository.deleteLogById(response[0].id);
    });
  });

  describe("getLogs", () => {
    it("should return an error if params empty", async () => {
      try {
        await LogRepository.getLogs({});
      } catch (err) {
        expect(err.message).toBe("Unable to get logs");
      }
    });

    it("should return an error if query params empty", async () => {
      try {
        await LogRepository.getLogs(null, {
          per_page: null,
          current_page: null,
        });
      } catch (err) {
        expect(err.message).toBe("Unable to get logs");
      }
    });

    it("should return an error if pagination params empty", async () => {
      try {
        await LogRepository.getLogs({
          email: null,
          domain: null,
        });
      } catch (err) {
        expect(err.message).toBe("Unable to get logs");
      }
    });

    it("should succeed", async () => {
      const response = await LogRepository.getLogs(
        {
          email: null,
          domain: null,
        },
        {
          per_page: null,
          current_page: null,
        },
      );

      expect(response.pagination.total).toBeGreaterThan(0);
      expect(response.pagination.per_page).toBe(25);
      expect(response.pagination.last_page).toBeGreaterThan(0);
      expect(response.pagination.current_page).toBe(1);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0].createdat).toBeDefined();
    });

    it("should succeed to return logs with email in query", async () => {
      const response = await LogRepository.getLogs(
        {
          email: errors[0].email,
          domain: null,
        },
        {
          per_page: null,
          current_page: null,
        },
      );

      expect(response.pagination.total).toBe(1);
      expect(response.pagination.per_page).toBe(25);
      expect(response.pagination.last_page).toBe(1);
      expect(response.pagination.current_page).toBe(1);
      expect(response.data.length).toBe(1);
      expect(response.data[0].email).toBe(errors[0].email);
    });

    it("should succeed to return logs with domain in query", async () => {
      const response = await LogRepository.getLogs(
        {
          email: null,
          domain: errors[1].domain,
        },
        {
          per_page: null,
          current_page: null,
        },
      );

      expect(response.pagination.total).toBe(2);
      expect(response.pagination.per_page).toBe(25);
      expect(response.pagination.last_page).toBe(1);
      expect(response.pagination.current_page).toBe(1);
      expect(response.data.length).toBe(2);
      expect(response.data[0].email).toBe(errors[1].email);
    });

    it("should succeed to return no log", async () => {
      const response = await LogRepository.getLogs(
        {
          email: errors[0].email,
          domain: errors[2].domain,
        },
        {
          per_page: null,
          current_page: null,
        },
      );

      expect(response.pagination.total).toBe(0);
      expect(response.pagination.per_page).toBe(25);
      expect(response.pagination.last_page).toBe(1);
      expect(response.pagination.current_page).toBe(1);
      expect(response.data.length).toBe(0);
      expect(response.data[0]?.email).toBeUndefined();
    });

    it("should succeed to return log with per_page pagination", async () => {
      const response = await LogRepository.getLogs(
        {
          email: null,
          domain: null,
        },
        {
          per_page: 1,
          current_page: null,
        },
      );

      expect(response.pagination.total).toBeGreaterThan(0);
      expect(response.pagination.per_page).toBe(1);
      expect(response.pagination.last_page).toBeGreaterThan(0);
      expect(response.pagination.current_page).toBe(1);
      expect(response.data.length).toBe(1);
      expect(response.data[0].email).toBeDefined();
    });

    it("should succeed to return log with current_page pagination", async () => {
      const response = await LogRepository.getLogs(
        {
          email: null,
          domain: null,
        },
        {
          per_page: null,
          current_page: 0,
        },
      );

      expect(response.pagination.total).toBeGreaterThan(0);
      expect(response.pagination.per_page).toBe(25);
      expect(response.pagination.last_page).toBeGreaterThan(0);
      expect(response.pagination.current_page).toBe(1);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0].createdat).toBeDefined();
    });
  });

  describe("findById", () => {
    it("should return an error if database crash", async () => {
      try {
        await LogRepository.findById();
      } catch (err) {
        expect(err.message).toBe("Unable to find log");
      }
    });

    it("should succeed", async () => {
      const response = await LogRepository.findById(fakeId);

      expect(response[0].id).toBe(fakeId);
    });
  });

  describe("deleteLogById", () => {
    it("should return an error if database crash", async () => {
      try {
        await LogRepository.deleteLogById();
      } catch (err) {
        expect(err.message).toBe("Unable to delete log");
      }
    });

    it("should succeed", async () => {
      const response = await LogRepository.deleteLogById(fakeId);

      expect(response).toBe(1);

      fakeId = null;
    });
  });
});
