"use strict";

module.exports = function(sequelize, DataTypes) {
	var Todo = sequelize.define("Todo", {
		text: DataTypes.STRING,
		done: DataTypes.BOOLEAN
	}, {
		classMethods: {
			associate: function(models) {
				Todo.belongsTo(models.User, {
					onDelete: "CASCADE",
					foreignKey: {
						allowNull: false
					}
				});
			}
		}
	});
	return Todo;
};