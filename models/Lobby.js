const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Lobby extends Model { }

Lobby.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    host_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
    },
    guest_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
    },
}, {
    sequelize,
});

module.exports = Lobby