const TABLE = 'users'

exports.up = async knex => {
  await knex.schema.createTable(TABLE, table => {
    table.increments()
    table.boolean('is_editing').defaultTo(false)
    table
      .string('name', 250)
      .notNullable()
      .index()
    table
      .string('email', 150)
      .notNullable()
      .unique()
      .index()
    table.string('password', 300).notNullable()
    table.string('reset_token', 300)
      .unique()
      .index()
    table.specificType('role_ids', 'INT[]')
    table.specificType('permission_ids', 'INT[]')
    table
      .boolean('is_active')
      .defaultTo(false)
      .index()
    table
      .integer('created_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE')
    table
      .integer('updated_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE')
    table.timestamps(true, true)
  })

  await knex.schema.raw(`
      CREATE TRIGGER ${TABLE}_updated_at
      BEFORE UPDATE ON ${TABLE} FOR EACH ROW
      EXECUTE PROCEDURE set_current_timestamp_on_update();
    `)

  return Promise
}

exports.down = async knex => knex.schema.raw(`DROP TABLE ${TABLE} CASCADE`)
