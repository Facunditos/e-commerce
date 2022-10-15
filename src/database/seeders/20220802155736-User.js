
const {faker}=require("@faker-js/faker");
const bcryptjs=require('bcryptjs');
function assingRoleId(index) {
  if (index%2==0) return 2 ;
  return 3
};
function createHashPassword(first_name) {
    const password=`${first_name}1234$`;
    return bcryptjs.hashSync(password)
};
//Se construte una lista de 50 usuarios en la que el primero de ellos es el usuario administrador
const usersList=
    Array(50)
    .fill(0)
    .map((e,index)=>{
        return {
        first_name:faker.name.firstName(),
        last_name:faker.name.lastName(),
        password:undefined,
        email:undefined,
        role_id:assingRoleId(index),
        image:faker.image.avatar(),
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
    });
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