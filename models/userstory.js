module.exports = function(sequelize, DataTypes) {
    var Userstory = sequelize.define("userstory", {
      story: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });

    Userstory.associate = function(models) {
        models.userstory.belongsTo(models.idea, {
          foreignKey: {
            allowNull: false
          }
        });
      };

    return Userstory;
  };
  