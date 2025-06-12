const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db= {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.user = require("./user.js")(sequelize, Sequelize); //사용자

(async () => {
    await db.sequelize.sync();
  
    // userId 1 사용자 존재 여부 확인
    const existingUser1 = await db.user.findByPk(1);
    if (!existingUser1) {
      await db.user.create({
        userId: 1,
        email: "user1@example.com",
        password: "hashed_pw_1", // 실제로는 해싱 필요
        name: "홍길동",
        nickname: "길동이",
        phoneNumber: "010-1111-1111",
        city: "서울시",
        district: "성북구",
        town: "역삼동",
        detail: "테스트 주소1",
        imageUrl: null,
        mysalt: "salt1"
      });
    }
  
    const existingUser2 = await db.user.findByPk(2);
    if (!existingUser2) {
      await db.user.create({
        userId: 2,
        email: "user2@example.com",
        password: "hashed_pw_2", // 실제로는 해싱 필요
        name: "이몽룡",
        nickname: "몽룡이",
        phoneNumber: "010-2222-2222",
        city: "서울시",
        district: "성북구",
        town: "돈암동",
        detail: "테스트 주소2",
        imageUrl: null,
        mysalt: "salt2"
      });
    }
  })();

  
module.exports= db;