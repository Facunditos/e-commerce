
const {faker}=require("@faker-js/faker")
const rolesNames=['Admin','Buyer','Seller'];
const defaultRoleDescription="This role doesn't have a description";
const rolesList=
  Array(3)
        .fill(0)
        .map((e,index)=>{
          return e={
            name:rolesNames[index],
            description:defaultRoleDescription,
            createdAt:new Date("2017-01-15 08:30:45"),
            updatedAt:new Date("2017-01-15 08:30:45"),
          }
        });
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Roles', 
     rolesList
     , {});
   
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
