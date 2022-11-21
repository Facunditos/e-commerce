
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
//Se construte una lista de 50 usuarios;
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
    });
const uniquesUsersList=[];
//Se aplica un forEach para: primero, definir el email en base al nombre y al apellido del usuario; segundo, eliminar aquellos productos con nombre repetido de manetal tal de evitarse que sea violada la constraint unique key aplicada sobre la column name; tercero, hashear la contraseña; y cuarto, asignar al updatedAt la misma fecha del creteadAt 
usersList.forEach((user,index)=>{
  user.email=`${user.first_name.toLowerCase()}${user.last_name.toLowerCase()}@gmail.com`;
  const userOnArray=uniquesUsersList.filter(userOnListFiltered=>userOnListFiltered.email===user.email) 
  const isUnique=userOnArray.length===0?true:false  
  if (isUnique){
    user.password=createHashPassword(user.first_name);
    user.updatedAt=user.createdAt;
    uniquesUsersList.push(user)
  };
}); 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      uniquesUsersList, 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    
  }
};