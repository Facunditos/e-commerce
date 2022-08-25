'use strict';

const {User,Product}=require("../models/index");
const {faker}=require("@faker-js/faker");

function assignRandomIntegerBetween(min,max) {
    const integer=Math.floor(Math.random()*(max-min)+min);
    return integer
};
function assignRandomOddIntegerBetween(min,max) {
  const integer=Math.floor(Math.random()*(max-min)+min);
  const oddInteger=integer%2==0?integer+1:integer;
    
  return oddInteger
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //Traigo el listado de los usuarios creados en la primera migración para asignarles usuarios compradores a las transacciones.
    const usersList=await User.findAll();
    
    //Traigo el listado de productos creado en la tercera migración para crear los detalles de las transacciones.
    const productsList=await Product.findAll();
    
    //Armo el listado de transacciones. Se definen que sean 13 en total. El valor de cada transacción queda indefindo hasta que se defina el detalle de cada una. 
    const transactionsAmount=Math.floor(usersList.length/4);
    
    const transactionsList=Array(transactionsAmount)
    .fill(0)
    .map((transaction,index)=>{
      
      
        return {
        buyer_user_id:assignRandomOddIntegerBetween(3,usersList.length),
        worth:undefined,
        createdAt:faker.date.recent(365*2),
        updatedAt:undefined,
        deletedAt:null
      }
    })
    .map((product)=>{
        product.updatedAt=product.createdAt;
        return product 
    }); 
   
    //Para construir el listado con el detalle de las transaciones, se parte de declarar un array denominado "transactionsProducts" sin elementos. Y corresponde, por cada ítem de las transacción, incorporar un elemento a este array. A su vez, cada ítem está representado por un subarray.  
    const transactionsProducts=[];
        //El primer elemento del subarray o ítem está representado por el id de la transacción respectiva. En este caso, se definieron 4 transacciones de un sólo ítem por transacción -primer ciclo for-; otras 4 transacciones de dos ítems por transacción -segundo ciclo for-; y por último, otras 5 transacciones de cinco ítems por transacción -tercer ciclo for-.
          //primer ciclo for
    const limitTransaccionesFirtsGroup=Math.floor(1/3*transactionsAmount);
    const limitTransaccionesSecondGroup=Math.floor(2/3*transactionsAmount);
    for (let transaction_id=1;transaction_id<=limitTransaccionesFirtsGroup;transaction_id++) {
        for (let amountItems=1;amountItems<=1;amountItems++) {
            transactionsProducts.push([transaction_id]);
        } 
    };
          //segundo ciclo for
    for (let transaction_id=limitTransaccionesFirtsGroup+1;transaction_id<=limitTransaccionesSecondGroup;transaction_id++) {
        for (let amountItems=1;amountItems<=2;amountItems++) {
            transactionsProducts.push([transaction_id])
        }  
    };
          //tercer ciclo for
    for (let transaction_id=limitTransaccionesSecondGroup+1;transaction_id<=transactionsAmount;transaction_id++) {
        for (let amountItems=1;amountItems<=5;amountItems++) {
            transactionsProducts.push([transaction_id])
        } 
    };
     
        //Luego se elige el producto asociado al ítem. Para ésto, se obtiene un número aleatorio que representa el índice que le corresponde a este producto en el listado de productos. Con este número índice elegido al azar, se va a buscar el "id" y el "precio" del producto en cuestión. La "cantidad" comprada del producto es asignada aleatoriamente con un límite de 34 unidades. Estos tres atributos o columnas completan el subarray. Para evitar que en una misma transacción existan dos ítems con el mismo producto, se elimian los productos seleccionados del listado de productos, ésto se hace únicamente dentro de la ejecución del método map, y no de manera global. Es necesario conservar el listado original de productos para calcular el valor de cada transacción. 
    transactionsProducts.map((detail,index)=>{
        let products=productsList
        const productIndex=assignRandomIntegerBetween(0,products.length);
        const product=products.find((product,index)=>index==productIndex);
        product.quantityBought=assignRandomIntegerBetween(1,34);
        detail.push(product.id,product.price,product.quantityBought);
        products.splice(productIndex,1)
        return detail
    });
    
    //Armo el listado con el detalle de las transacciones en base al array completado previamente. 
    const detailsAmount=limitTransaccionesFirtsGroup*1+(limitTransaccionesSecondGroup-limitTransaccionesFirtsGroup)*2+(transactionsAmount-limitTransaccionesSecondGroup)*5;
    const transactionsProductsList=Array(detailsAmount)
    .fill(0)
    .map((detail,index)=>{
      
      
        return {
        transaction_id:transactionsProducts[index][0],
        product_id:transactionsProducts[index][1],
        price:transactionsProducts[index][2],
        quantity:transactionsProducts[index][3],
        createdAt:faker.date.recent(365*2),
        updatedAt:undefined,
        deletedAt:null
      }
    })
    .map((detail)=>{
        detail.updatedAt=detail.createdAt;
        return detail 
    }); 

    // Por último, falta definir el valor del atributo o la propiedad que representa el costo de la transacción. Para hacerlo, en primera instancia, se declara un array vacío denominado "transactionsWorth"; y luego, en segunda instancia, se intera en total 13 veces, porque son transacciones, para, primero, construir un array integrado por los ítems que comparten el id de la transacción, segundo, a través del método reduce calcular el gasto total efectuado en la transacción, y por último, sumar lo que arrojó el cálculo anterior como elemento del array "transactionsWorth". 
    const transactionsWorth=[];
    for (let transaction_id=1;transaction_id<=transactionsAmount;transaction_id++) {
      const transactionDetails=transactionsProducts.filter((detail)=>detail[0]==transaction_id);
      const transactionWorth=transactionDetails.reduce((worth,detail)=>{
          const price=detail[2];
          const quantity=detail[3];
          return worth+price*quantity
      },0);
      transactionsWorth.push(transactionWorth)
    };

    //Se completa el listado de las transacciones
    transactionsList.map((transaction,index)=>{
      return transaction.worth=transactionsWorth[index]
    })

    await queryInterface.bulkInsert(
      'Transactions',
      transactionsList, 
      {}
    );
    await queryInterface.bulkInsert(
      'Transaction_Product',
      transactionsProductsList, 
      {}
    ); 
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Transactions', null, {});
    await queryInterface.bulkDelete('Transaction_Product', null, {});
    
  }
};