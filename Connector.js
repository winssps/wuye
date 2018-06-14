


const mysqlx = require('@mysql/xdevapi');



function Connector() {
    this.session = null;
    this.connection = {
        row: []
    };

};

export default Connector;

/**
 * [获取session]
 */
Connector.prototype.connect = async function (options, schema) {
    this.session = mysqlx.getSession(options)
        .then(session => {
            return session.getSchema(schema);
        });
};

/**
 * [selectDatabase description]
 * @param  {[type]} tablename [表名]
 * @param  {[type]} select    [数据]
 * @return {[type]} row       [行数据]
 */
Connector.prototype.selectDatabase = async function (tablename, select) {
    await this.session
        .then(schema => {
            return schema.getTable(tablename);
        })
        .then(table => {
            this.connection.row = [];
            return table
                .select()
                .where(select)
                .execute(row => {
                  //  console.log(row);
                    this.connection.row.push(row);
                });
        })
        .catch(err => {
            console.log(err);
        });
    return this.connection.row;
};


/**
 * [insertDatabase description]
 * @param  {[type]} tablename [表名]
 * @param  {[type]} value     [插入的数据]
 * @return {[type]}           [description]
 */
Connector.prototype.insertDatas = async function (tablename, value) {
    await this.session
        .then(schema => {
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
 * @param  {[type]}  tablename [表名]
 * @param  {[type]}  expr      [条件]
 * @return {Promise}           [description]
 */
Connector.prototype.deleteDatas = async function (tablename, expr) {

    await this.session
        .then(schema => {
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
 * [更新数据库]
 * @param  {[type]}  tablename [表名]
 * @param  {[type]}  expr      [参数]
 * @param  {[type]}  field     [某一个列]
 * @param  {[type]}  value     [更新值]
 * @return {Promise}           [description]
 */

Connector.prototype.updateDatas = async function (tablename, expr, field, value) {

    await this.session
        .then(schema => {
            return schema.getTable(tablename);
        })
        .then(table => {
            return table
                .update()
                .where(expr)
                .set(field, value)
                .execute();
        })
        .catch(err => {
            console.log(err);
        });
}


