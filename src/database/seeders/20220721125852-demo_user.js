'use strict';
const bcryptjs=require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      first_name:"Facundo",
      last_name:"López Crespo",
      email:"facundolopezcrespo@hotmail.com",
      password:bcryptjs.hashSync("Facundo0301",10),
      is_admin:true,
      createdAt:new Date,
      updatedAt:new Date,
      deletedAt:null
      },{
      first_name: 'Martín',
      last_name:'Taparelli',
      email:'martintaparelli@gmail.com',
      password:bcryptjs.hashSync('Martin1234',10),
      createdAt:new Date,
      updatedAt:new Date,
      deletedAt:null
     },{
      first_name: 'Maite',
      last_name:'López',
      email:'maitelopez@gmail.com',
      password:bcryptjs.hashSync('Maite1234',10),
      createdAt:new Date,
      updatedAt:new Date,
      deletedAt:null
    },{
      first_name: 'Agustín',
      last_name:'Fernández',
      email:'agustinfernandez@gmail.com',
      password:bcryptjs.hashSync('Agustin1234',10),
      createdAt:new Date,
      updatedAt:new Date,
      deletedAt:null
    },{
      first_name: 'Javier',
      last_name:'Kleir',
      email:'javierkleier@gmail.com',
      password:bcryptjs.hashSync('Javier1234',10),
      createdAt:new Date,
      updatedAt:new Date,
      deletedAt:null
    },{
      first_name: 'Santiago',
      last_name:'Landucci',
      email:'santiagolanducci@gmail.com',
      password:bcryptjs.hashSync('Santiago1234',10),
      createdAt:new Date,
      updatedAt:new Date,
      deletedAt:null
    },{
      first_name: 'Ignacio',
      last_name:'Belloqui',
      email:'ignaciobeloqui@gmail.com',
      password:bcryptjs.hashSync('Ignacio1234',10),
      createdAt:new Date,
      updatedAt:new Date,
      deletedAt:null
    },{
      first_name: 'Julián',
      last_name:'Mattos',
      email:'julianmattos@gmail.com',
      password:bcryptjs.hashSync('Julian1234',10),
      createdAt:new Date,
      updatedAt:new Date,
      deletedAt:null
    },], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    
  }
};