import logRepository from "../repositories/LogRepository";
import {
  createLogService,
  deleteLogService,
  getLogService,
} from "./logServices";
import { database } from "../config/connection.js";

describe("logServices", () => {
  let newlogId;

  afterEach(async () => {
    if (newlogId) {
      const log = await logRepository.findById(newlogId);

      if (log.length > 0) await logRepository.deleteLogById(log[0].id);
    }
  });

  afterAll(async () => {
    database.destroy();
  });

  describe("createLogService", () => {
    it("should return an error 'Body fields can't be empty'", async () => {
      const { error, status, data } = await createLogService({
        type: "",
        message: "",
        stack: "",
        email: "",
      });

      expect(error).toBe("Body fields can't be empty");
      expect(status).toBe(406);
      expect(data).toBeNull();
    });

    it("should return an error 'Unable to create log'", async () => {
      const fakeLog = {
        type: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est dolor iste minima ducimus laborum maiores laboriosam accusantium nisi porro corporis beatae ipsa, esse deserunt voluptatem totam perspiciatis nam tempora saepe culpa asperiores ab nemo error. At non nesciunt fugit, animi numquam vel dolore nam. Recusandae quam qui a esse, non corporis ex laudantium est nihil libero nesciunt debitis numquam accusamus expedita quasi unde ipsa labore commodi ipsam autem vero necessitatibus! Quas, quia ullam dicta nulla beatae eum veritatis eligendi et delectus quidem mollitia temporibus id. Iste sequi maiores nulla debitis quo eveniet ipsum modi quasi nihil nostrum repudiandae fugit sit consectetur recusandae, dicta nobis velit ad dolore omnis dolorum qui iusto perferendis neque. Sapiente temporibus, minima culpa aliquam velit dicta tempore suscipit itaque ipsa dolorem? Libero asperiores repellat quaerat quibusdam cumque error ipsum atque, optio quod ipsa suscipit dolorem voluptatibus? Sed impedit necessitatibus minus accusantium aut vero dolor doloremque eligendi excepturi, sapiente quo? Repellendus facilis sed tempore unde, asperiores fuga incidunt temporibus nam sapiente ducimus tenetur necessitatibus veritatis ea? Voluptas minima laudantium atque inventore ducimus accusantium nemo magnam autem voluptatem nobis. Sequi earum officia impedit, voluptatem corrupti vero pariatur illo minima soluta fugit. Alias optio odit quam ab quis, quibusdam amet ullam officia consequuntur perspiciatis suscipit doloribus voluptas magnam molestiae error exercitationem, tempore delectus, neque corporis? Quaerat maxime sed molestias labore eligendi esse nihil ipsa natus corporis quo mollitia laborum magni, repellat reprehenderit eos ipsum dicta, distinctio consequuntur voluptatum fugiat debitis sint hic? Facere rerum ex labore. Corrupti tenetur architecto aut sit, quo similique dolore saepe quod corporis.",
        message: "message",
        stack: "stack",
        email: "test@createLogService.com",
      };
      const { error, status, data } = await createLogService(fakeLog);

      expect(error).toBe("Unable to create log");
      expect(status).toBe(500);
      expect(data).toBeNull();
    });

    it("should succeed", async () => {
      const newLog = {
        type: "ReferenceError",
        message: "message",
        stack: "stack",
        email: "test@createLogService.com",
      };

      const { error, status, data } = await createLogService(newLog);

      newlogId = data[0].id;

      expect(error).toBeNull();
      expect(status).toBeNull();
      expect(data[0].type).toBe("ReferenceError");
      expect(data[0].message).toBe("message");
      expect(data[0].stack).toBe("stack");
      expect(data[0].email).toBe("test@createLogService.com");
    });
  });

  describe("getLogService", () => {
    it("should return an error 'Unable to fetch logs'", async () => {
      const { error, status, data } = await getLogService({});

      expect(error).toBe("Unable to fetch logs");
      expect(status).toBe(500);
      expect(data).toBeNull();
    });

    it("should succeed", async () => {
      const newLog = await logRepository.createLog({
        email: "test@getLogService.com",
        domain: "getLogService",
        type: "ReferenceError",
        message: "message",
        stack: "stack",
        createdat: new Date(),
      });

      newlogId = newLog[0].id;

      const query = {
        email: "test@getLogService.com",
        domain: "getLogService",
      };
      const pagination = {
        per_page: 30,
        page: 1,
      };

      let { error, status, data } = await getLogService(query, pagination);

      expect(error).toBeNull();
      expect(status).toBeNull();
      expect(data.logs[0].email).toBe("test@getLogService.com");
      expect(data.logs[0].domain).toBe("getLogService");
      expect(data.pagination.total).toBe(1);
      expect(data.params.email).toBe("test@getLogService.com");
      expect(data.params.domain).toBe("getLogService");
    });
  });

  describe("deleteLogService", () => {
    it("should return an error 'Unable to delete log'", async () => {
      const { error, status, data } = await deleteLogService({});

      expect(error).toBe("Unable to delete log");
      expect(status).toBe(500);
      expect(data).toBe(null);
    });

    it("should succeed", async () => {
      const newLog = await logRepository.createLog({
        email: "test@deleteLogService.com",
        domain: "domaine",
        type: "ReferenceError",
        message: "message",
        stack: "stack",
        createdat: new Date(),
      });

      const log = await logRepository.findById(newLog[0].id);

      const { error, status, data } = await deleteLogService(log[0].id);

      expect(error).toBeNull();
      expect(status).toBeNull();
      expect(data).toBe(log[0].id);
    });
  });
});
