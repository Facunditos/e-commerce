const path=require("path");

const swaggerSpec={
    definition:{
        openapi:"3.0.0",
        info:{
            title:'e-commerce',
            version:'1.0.0',
            description:'Welcome, this is an e-commerce, you can register as a user to buy or to sell products'
        },
        servers:[
            {
                url:'http://localhost:3030'
            }
            //corresponde indicar el servidor donde se aloja la apps
        ]
    },
    apis:[
        `${path.join(__dirname,'*.js')}`
    ]
};
module.exports=swaggerSpec;