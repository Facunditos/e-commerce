'use strict';
const {faker}=require("@faker-js/faker");
const bcryptjs=require('bcryptjs')
function createHashPassword(first_name) {
    const password=`${first_name}1234$`;
    return bcryptjs.hashSync(password)
};
//Se construte una lista de 50 usuarios en la que el primero de ellos es el usuario administrador
const usersList=
    Array(50)
    .fill(0)
    .map(()=>{
        return {
        first_name:faker.name.firstName(),
        last_name:faker.name.lastName(),
        password:undefined,
        email:undefined,
        is_admin:false,
        createdAt:faker.date.recent(365*2),
        updatedAt:undefined,
        deletedAt:null
        }
    })
    .map((user)=>{
        user.password=createHashPassword(user.first_name);
        user.email=`${user.first_name.toLowerCase()}${user.last_name.toLowerCase()}@gmail.com`;
        user.updatedAt=user.createdAt;
        return user;
    })
    .fill({
        first_name:"Admin",
        last_name:"Admin",
        email:"ecommerce1287@gmai.com",
        password:createHashPassword('Admin'),
        is_admin:true,
        createdAt:new Date,
        updatedAt:new Date,
        deletedAt:null
    },0,1);
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      usersList, 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    
  }
};