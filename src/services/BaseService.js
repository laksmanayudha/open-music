const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { splitKeyAndValue } = require('../utils');

class BaseService {
  constructor(table) {
    this._table = table;
    this._pool = new Pool();
    this._primaryKey = 'id';
  }

  _generateId() {
    return `${this._table}-${nanoid(16)}`;
  }

  async _all() {
    const result = await this._pool.query(`SELECT * FROM ${this._table}`);
    return result.rows;
  }

  async _find(id) {
    const result = await this._pool.query({
      query: `SELECT * FROM ${this._table} WHERE ${this._primaryKey} = $1`,
      values: [id],
    });

    return result.rows;
  }

  async _insert(data) {
    const newData = { [this._primaryKey]: this._generateId(), ...data };
    const splitted = splitKeyAndValue(newData);
    const escapedInsert = splitted.orders.map(({ seq }) => `$${seq}`).join(',');
    const columns = splitted.keys.join(',');

    const result = await this._pool.query({
      text: `INSERT INTO ${this._table} (${columns}) VALUES (${escapedInsert}) RETURNING ${this._primaryKey}`,
      values: splitted.values,
    });

    return result.rows;
  }

  async _update(id, data) {
    const splitted = splitKeyAndValue(data);
    const escapedUpdate = splitted.orders.map(({ key, seq }) => `${key} = $${seq}`).join(',');

    const result = await this._pool.query({
      text: `UPDATE ${this._table} SET ${escapedUpdate} WHERE ${this._primaryKey} = $${splitted.orders.length + 1} RETURNING ${this._primaryKey}`,
      values: [...splitted.values, id],
    });

    return result.rows;
  }

  async _delete(id) {
    const result = await this._pool.query({
      text: `DELETE FROM ${this._table} WHERE ${this._primaryKey} = $1 RETURNING ${this._primaryKey}`,
      values: [id],
    });

    return result.rows;
  }
}

module.exports = BaseService;
