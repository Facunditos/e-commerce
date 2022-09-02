const {Transaction}=require("./database/models/index");

async function agregarItem() {
    try{
        const transaction=await Transaction.findByPk(13);
        const item=await transaction.addProducts([42,43],
            {through:{
                price:[12.12,42.78],
                quantity:[15,22]
            }}
        );
        return console.log(item);
    } catch(e){console.log(e);}
    
};

agregarItem()