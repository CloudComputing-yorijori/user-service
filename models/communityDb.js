const { Sequelize, DataTypes } = require("sequelize");

const communityDb = new Sequelize("yorijori", "root", "root", {
  host: "mysql",  // 커뮤니티 MySQL 서비스 이름 (Kubernetes 내부 DNS)
  port: 3306,
  dialect: "mysql",
  logging: false
});

const CommunityUser = communityDb.define("user", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(1024),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  town: {
    type: DataTypes.STRING,
    allowNull: false
  },
  detail: {
    type: DataTypes.STRING
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  mysalt: {
    type: DataTypes.STRING
  }
}, {
  tableName: "users",
  timestamps: false
});

module.exports = {
  CommunityUser,
  communityDb
};
