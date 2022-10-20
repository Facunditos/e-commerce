const path=require("path");

const swaggerSpec={
    definition:{
        openapi:"3.0.0",
        info:{
            title:'e-commerce',
            version:'1.0.0',
            description:'Welcome, this is an e-commerce, you can register as a user to buy or to sell products'
        },
        components:{
            securitySchemes:{
                apiKeyAuth:{
                    type:'apiKey',
                    in:'header',
                    name:'token',
                }, 
            },
            parameters:{
                Pagination:{
                    in:'query',
                    name:'page',
                    schema:{
                       type:'integer' 
                    },
                    description:'the page to go to'  
                },
                ID:{
                    in:'path',
                    name:'id',
                    schema:{
                       type:'integer', 
                       minimum:1
                    },
                    description:'the primary key of the resource in the table'  
                },
            },
            responses:{
                BadRequest:{
                    description:'Bad Request',
                },
                BadRequest:{
                    description:'Bad Request',
                },
                Unauthorized:{
                    description:'Unauthorized'
                },
                Forbbiden:{
                    description:'Forbbiden'
                },
                NotFound:{
                    description:'Not Found'
                },
                ErrorServer:{
                    description:'Internal Server Error'
                }
            },
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