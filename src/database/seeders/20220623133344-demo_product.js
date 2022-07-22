'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('products', [{
        name: "Azucar Blanca Arcor Bolsa X 1 Kg",
        description: "El vendedor no incluyó una descripción del producto",
        quantity: 50,
        status: "activo",
        seller_user_id: 2,
        category_id:1,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Galletitas Terepin Pepas Dulce De Membrillo Mermelada",
        description: "Galletas dulces con mermelada de membrillo",
        quantity: 30,
        status: "activo",
        seller_user_id: 2,
        category_id:1,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Pava eléctrica Mega Express ME-621 acero inoxidable 220V 1.8L",
        description: "¡Tené el agua caliente siempre lista! Con la pava eléctrica Mega Express ME-621 vas a poder disfrutar de una bebida caliente en minutos. Ganá tiempo y prepará ese mate, cafecito o porqué no, esa sopa instantánea que tanto te gusta.",
        quantity: 10,
        status: "activo",
        seller_user_id: 3,
        category_id:2,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Exprimidor eléctrico Yelmo EX-1303 700ml 25W blanco 220V",
        description: "Disfrutá de deliciosos sabores frutales con tu Yelmo EX-1303. Exprimí cítricos de manera sencilla y obtené todo el jugo que necesitás para que tus desayunos y meriendas sean aún más ricas.",
        quantity: 15,
        status: "activo",
        seller_user_id: 3,
        category_id:2,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Escritorio Centro Estant paris melamina de 120cm x 78cm x 50cm blanco",
        description: "Ya sea para estudiar o trabajar, este escritorio Centro Estant te ayudará a crear un ambiente confortable y sumar orden y funcionalidad a tus horas productivas. Su superficie no sólo te servirá de apoyo, sino que te permitirá tener los recursos al alcance de la mano para facilitar tus tareas.",
        quantity: 5,
        status: "activo",
        seller_user_id: 4,
        category_id:3,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Silla de escritorio Good Game Pro negra y roja con tapizado de cuero sintético",
        description: "La selección de una silla adecuada es muy importante para prevenir futuras lesiones. Con esta silla Good Game, vas a tener la comodidad y el bienestar que necesitás a lo largo de tu jornada. Además, podés ubicarla en cualquier parte de tu casa u oficina ya que su diseño se adapta a múltiples entornos. ¡Dale a tus espacios un toque más moderno!",
        quantity: 5,
        status: "activo",
        seller_user_id: 4,
        category_id:3,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Taladro percutor eléctrico de 13mm Philco TP711 710W + accesorios 220V",
        description: "Con el taladro eléctrico Philco TP711 podrás realizar múltiples tareas en diversas superficies de un modo práctico y sencillo. Su potencia de 710 W te ofrecerá gran capacidad de perforación.",
        quantity: 50,
        status: "activo",
        seller_user_id: 5,
        category_id:4,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Juego De Llaves Combinadas Fija Estriada 12 Piezas 6 A 22 Mm",
        description: "SET JUEGO LLAVES COMBINADAS 12 PIEZAS DE 6 A 22 MM .",
        quantity: 50,
        status: "activo",
        seller_user_id: 5,
        category_id:4,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      }], {});
   
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
