module.exports = function(sequelize, DataTypes) {
  var Idea = sequelize.define("idea", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tech_used: {
      type: DataTypes.STRING,
      allowNull: false
    },
    members_only: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  Idea.associate = function(models) {
    models.idea.hasMany(models.userstory, {
      onDelete: "cascade"
    });
  };

  return Idea;
};
