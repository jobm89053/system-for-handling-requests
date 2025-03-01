/*const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('system_for_handling_requests', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;*/
module.exports = {
    host: '127.0.0.1',
    user: 'root',
    password:'123456',
    database: 'system_for_handling_requests',
    port: 3306
}