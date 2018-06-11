
import Connector from './Connector';

const mysql = new Connector();


const options = {
    host: 'localhost',
    port: 33060,
    password: '12345678',
    user: 'root',
    schema: 'pro_server',
};


/**
 * [连接数据库]
 */
(function (options) {
    mysql.connect(options, options.schema);
})(options);

export default mysql;




