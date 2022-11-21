'use strict';
const {faker}=require("@faker-js/faker");
//Se construte una lista de categorías de productos.
const  categoriesList=
  Array(100)
      .fill(0)
      .map(()=>{
          return {
            name:faker.commerce.department(),
            description:"This category doesn't have a description",
            createdAt:faker.date.recent(365*2),
            updatedAt:undefined,
            deletedAt:null
          } 
          
      })
//Se definió que, las categorías con id par, sí tienen texto de descripción.
let cantidadDeCategoriasEliminadad=0
//Se aplica un forEach para: primero, eliminar aquellos productos con nombre repetido de manetal tal de evitarse que sea violada la constraint unique key aplicada sobre la column name; segundo, editar la descripción en caso que el id sea par; y tercero, asignar al updatedAt la misma fecha del creteadAt 
categoriesList.forEach((category,index)=>{
  if (index%2===0) category.description=faker.lorem.text();
  category.updatedAt=category.createdAt;
  if (categoriesList.filter(categoryOnList=>categoryOnList.name===category.name).length>1){
    cantidadDeCategoriasEliminadad++;
    categoriesList.splice(index,1);

  };
}); 

categoriesList.sort(function (a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
const uniquesCategoriesList=[];
categoriesList.forEach((category,index)=>{
    const categoryOnArray=uniquesCategoriesList.filter(categoryOnListFiltered=>categoryOnListFiltered.name===category.name) 
    const isUnique=categoryOnArray.length===0?true:false  
    if (isUnique){
        uniquesCategoriesList.push(category)
    };
}); 
console.log(uniquesCategoriesList.length);
 