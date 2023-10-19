import knex from "knex";
import knexConfiguration from "../../knexfile.js";

const environment = process.env.NODE_ENV || "development";

export const database = knex(knexConfiguration[environment]);
