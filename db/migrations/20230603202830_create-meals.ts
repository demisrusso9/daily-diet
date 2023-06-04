import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.integer('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('healthy_diet').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}