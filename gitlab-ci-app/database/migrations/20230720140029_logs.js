/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("logs", t => {
    t.increments("id").unsigned().primary();
    t.string("email").notNullable();
    t.string("domain").notNullable();
    t.string("type").notNullable();
    t.string("message").notNullable();
    t.text("stack").notNullable();
    t.timestamp("createdat").notNullable();
    t.timestamp("deletedat").nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("logs");
}
