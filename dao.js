const mysql = require('./database/mysql');

const DAO = function (tableName) {
    this.tableName = tableName;

    const query = async (sql, data = []) => {
        const db = await mysql.db;
        return await db.query(sql, data);
    };

    const findAll = async () => {
        const rows = await query('SELECT * FROM ??', [this.tableName]);
        return rows[0];
    };

    const findOneById = async id => {
        const rows = await query('SELECT * FROM ?? WHERE id=?', [
            this.tableName,
            id,
        ]);
        return rows[0][0];
    };

    const findOneBy = async (fieldName, value) => {
        const rows = await query('SELECT * FROM ?? WHERE ??=?', [
            this.tableName,
            fieldName,
            value,
        ]);
        return rows[0][0];
    };

    const insertOne = async data => {
        const sql = 'INSERT INTO ?? SET ?';
        const result = await query(sql, [this.tableName, data]);
        return result[0];
    };

    const deleteOneById = async id => {
        const result = await query('DELETE FROM ?? WHERE id=?', [
            this.tableName,
            id,
        ]);
        console.log(result);
        return result[0];
    };

    const updateOne = async (data, id) => {
        const result = await query('UPDATE ?? SET ? WHERE id=?', [
            this.tableName,
            data,
            id,
        ]);
        return result[0];
    };

    return {
        findAll,
        findOneById,
        findOneBy,
        insertOne,
        deleteOneById,
        updateOne,
        query,
    };
};

module.exports = DAO;
