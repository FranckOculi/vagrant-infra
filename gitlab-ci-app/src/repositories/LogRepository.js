import { database } from "../config/connection.js";

class LogRepository {
  table = "logs";

  createLog = async function (data) {
    try {
      const response_insert = await database(this.table)
        .insert(data)
        .returning("id");

      const response_data = await this.findById(response_insert[0].id);

      return response_data;
    } catch (err) {
      throw new Error("Unable to create log");
    }
  };

  getLogs = async function (query, pagination) {
    try {
      const per_page = pagination.per_page || 25;
      const page = pagination.current_page || 1;

      if (page < 1) page = 1;
      const offset = (page - 1) * per_page;

      const data_request = database(this.table).select(
        "email",
        "domain",
        "type",
        "message",
        "stack",
        "createdat",
      );
      const count_request = database(this.table).count("*");

      const addCondition = (key, value) => {
        let first_condition = true;
        if (value) {
          if (first_condition) {
            first_condition = false;
            data_request.whereLike(key, `%${value}%`);
            count_request.whereLike(key, `%${value}%`);
          } else {
            data_request.andWhereLike(key, `%${value}%`);
            count_request.whereLike(key, `%${value}%`);
          }
        }
      };
      const params = Object.entries(query);
      params.forEach(([key, value]) => addCondition(key, value));

      data_request.orderBy("createdat", "desc").limit(per_page).offset(offset);

      const data = await data_request;
      const total = await count_request;

      const response = {
        pagination: {
          total: parseInt(total[0].count),
          per_page,
          last_page:
            Math.ceil(parseInt(total[0].count) / per_page) < 1
              ? 1
              : Math.ceil(parseInt(total[0].count) / per_page),
          current_page: page,
        },
        data,
      };

      return response;
    } catch (err) {
      throw new Error("Unable to get logs");
    }
  };

  findById = async function (id) {
    try {
      const response = await database(this.table)
        .select("id", "email", "domain", "type", "message", "stack")
        .where({ id });

      return response;
    } catch (err) {
      throw new Error("Unable to find log");
    }
  };

  deleteLogById = async function (id) {
    try {
      const response = await database(this.table).where({ id }).del();

      return response;
    } catch (err) {
      throw new Error("Unable to delete log");
    }
  };
}

export default new LogRepository();
