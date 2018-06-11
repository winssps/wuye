const mysqlx = require('@mysql/xdevapi');


const schemaname = "pro_server";
const options = {
    host: 'localhost',
    port: 33060,
    password: '12345678',
    user: 'root'
};



const connectDatabase = async (dbname) => {
    return mysqlx.getSession(options)
        .then(session => {
            return session.getSchema(dbname);
        });
}

/**
 * [selectDatabase description]
 * @param  {[type]} tablename [表名]
 * @param  {[type]} select    [数据]
 * @return {[type]}           [null]
 */
export const selectDatabase = async (tablename, select) => {
    console.log(mysqlx);
    let connection = {};
    const session = connectDatabase(schemaname);
    await session
        .then(schema => {
            connection.schema = schema;
            return schema.getTable(tablename);
        })
        .then(table => {
            connection.row = [];
            return table
                .select()
                .where(select)
                .execute(row => {
                    connection.row.push(row);
                });
        })
        .catch(err => {
            console.log(err);
        });
    return connection.row;
}

/**
 * [insertDatabase description]
 * @param  {[type]} tablename [表名]
 * @param  {[type]} value     [插入的数据]
 * @return {[type]}           [description]
 */
export const insertDatas = async (tablename, value) => {
    const connection = {};
    const session = connectDatabase(schemaname);
    await session
        .then(schema => {
            connection.schema = schema;
            return schema.getTable(tablename);
        })
        .then(table => {
            return table.insert(value).execute();
        })
        .catch(err => {
            console.log(err);
        });
}

/**
 * [deleteDatas description]
 * @param  {[type]}  tablename [description]
 * @param  {[type]}  expr     [description]
 * @return {Promise}           [description]
 */
export const deleteDatas = async (tablename, expr) => {
    const connection = {};
    const session = connectDatabase(schemaname);
    await session
        .then(schema => {
            connection.schema = schema;
            return schema.getTable(tablename);
        })
        .then(table => {
            return table.delete(expr).execute();
        })
        .catch(err => {
            console.log(err);
        });
}
/**
 * [updateDatas description]
 * @param  {[type]}  tablename [description]
 * @param  {[type]}  expr      [description]
 * @param  {[type]}  value     [description]
 * @return {Promise}           [description]
 */
export const updateDatas = async (tablename, expr, value) => {
    const connection = {};
    const session = connectDatabase(schemaname);
    await session
        .then(schema => {
            connection.schema = schema;
            return schema.getTable(tablename);
        })
        .then(table => {
            return table
                .update()
                .where(expr)
                .set('name', value)
                .execute();
        })
        .catch(err => {
            console.log(err);
        });
}
