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
                SearchByName:{
                    in:'query',
                    name:'name',
                    schema:{
                       type:'string' 
                    },
                    required:true,
                    description:'the past string is used to find specific records whose name include it',
                    examples:{
                        "First Example (undefined)":{
                            value:undefined,
                        },
                        "Second Example (car)":{
                            value:'car'
                        },
                        "Third Example (zapatillas)":{
                            value:'zapatillas'
                        },
                    },
                },
                OrderBy:{
                    in:'query',
                    name:'orderBy',
                    schema:{
                       type:'string' 
                    },
                    required:false,
                    description:"It is the attribute used to sort the search results. Default: sales",
                    examples:{
                        "First Example (undefined)":{
                            value:undefined,
                        },
                        "Second Example (sales)":{
                            value:'sales'
                        },
                        "Third Example (price)":{
                            value:'price'
                        },
                        "Fourth (bad request)":{
                            value:'stock'
                        },
                    }
                },
                Order:{
                    in:'query',
                    name:'order',
                    schema:{
                       type:'string' 
                    },
                    required:false,
                    description:"The search results could be ordered ascendantly or descendingly. Default: this depend on the order by query",
                    examples:{
                        "First Example (Undefined)":{
                            value:undefined,
                        },
                        "Second Example (asc)":{
                            value:'asc'
                        },
                        "Third Example (desc)":{
                            value:'desc'
                        },
                        "Fourth (BadRequest)":{
                            value:'as'
                        },
                    }
                },
                SellerId:{
                    in:'query',
                    name:'sellerId',
                    schema:{
                       type:'integer' 
                    },
                    description:'If the the admin is who make the request this query has to be include',
                    examples:{
                        "First Example (undefined)":{
                            value:undefined,
                        },
                        "Second Example (not found)":{
                            value:10000
                        },
                    },
                },
                Pagination:{
                    in:'query',
                    name:'page',
                    schema:{
                       type:'integer' 
                    },
                    description:'the page to go to. Default: 1',
                    examples:{
                        "First Example (undefined)":{
                            value:undefined,
                        },
                        "Second Example (bad request)":{
                            value:-5,
                        },
                        "Third Example (not found)":{
                            value:10000
                        },
                    },
                },
                ID:{
                    in:'path',
                    name:'id',
                    schema:{
                       type:'integer', 
                       minimum:1
                    },
                    required:true,
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
                url:'http://demo-e-commerce.com.ar:3030/'
            },
            {
                url:'http://localhost:3030/'
            },
            //corresponde indicar el servidor donde se aloja la apps
        ]
    },
    apis:[
        `${path.join(__dirname,'*.js')}`
    ]
};
module.exports=swaggerSpec;