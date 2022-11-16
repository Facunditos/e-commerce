/**
 *@swagger
 * components:
 *  schemas:
 *     Product:
 *       type: object
 *       properties:
 *        id:
 *         type: integer      
 *         example: 2                            
 *        name:
 *         type: string
 *         minLength: 3 
 *         example: 'Awesome Bronze Keyboard'
 *         description: 'unique in the DB'
 *        description:
 *         type: string
 *         description: It could be sended empty and the server will use a default value
 *         example: 'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support'
 *        price:
 *         type: number
 *         format: float
 *         minimum: 0
 *         example: 150.20  
 *        seller_user_id:
 *         type: integer
 *         minimum: 1
 *         example: 40   
 *         description: seller user ID, must belong to existing seller user
 *        category_id:
 *         type: integer
 *         minimum: 1
 *         example: 17   
 *         description: category ID, must belong to existing category
 *        stock:
 *         type: integer
 *         minimum: 0
 *         example: 15 
 *        status:
 *         type: string
 *         example: active  
 *         description: 'It could be active or inactive'
 *        image:
 *         type: string
 *         format: binary
 *         example: 'https://ecommerce1287.s3.sa-east-1.amazonaws.com/product-img/product-1663617922362.jpg'
 *        createdAt:
 *         type: string
 *         format: date-time
 *         example: '2022-18-10 16:20:10'
 *        updatedAt:
 *         type: string
 *         format: date-time
 *         example: '2022-18-10 16:20:10'
 *        deletedAt:
 *         type: string
 *         format: date-time 
 *         description: 'This attribute is necessary to use the soft delete method'
 *         example: null
 *       required:
 *         - name
 *         - price
 *         - category_id
 *         - stock
 *         - status
 *         - image
 *       example:
 *          id: 2
 *          name: 'Pelota Mundial De Fútbol Copa Del Mundo'
 *          description: 'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support'
 *          price: 3573.63
 *          seller_user_id: 40
 *          category_id: 17
 *          stock: 22
 *          status: active
 *          image: 'https://ecommerce1287.s3.sa-east-1.amazonaws.com/product-img/product-1663617922362.jpg'
 *          createdAt: '2022-18-10 16:20:10'
 *          updatedAt: '2022-18-10 16:20:10'
 *          deletedAt: null
 */

/**
 * @swagger
 * /api/v1/products:
 *  get:
 *      tags: ['Product']       
 *      summary: 'Get a products list'  
 *      description: "Returns a list of five products sorted by page and sales, starting with page 1 and the top selling products, returns 
 *       the previus and next page links according the page number you're currently on. This list excludes products without stock. This request could be done by any user"
 *      parameters: 
 *          - $ref: '#/components/parameters/Pagination'
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'
 *                              previosPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the previos page'
 *                              nextPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the next page'
 *                              count:
 *                                  type: integer
 *                                  description: 'The amount of products in the DB'                
 *                              products: 
 *                                  type: array
 *                                  description: array of products 
 *                                  items: 
 *                                      $ref: '#/components/schemas/Product'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/products?page=1'
 *                              nextPage: '/api/v1/products?page=3'
 *                              count: 100               
 *                              products:
 *                                  - "id": 57,
 *                                    "name": "Intelligent Granite Ball"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 300749.77
 *                                  - "id": 35,
 *                                    "name": "Refined Granite Computer"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 293194.05
 *                                  - "id": 91
 *                                    "name": "Practical Bronze Ball"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 274829.27
 *                                  - "id": 18
 *                                    "name": "Handcrafted Metal Salad"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 206864.82
 *                                  - "id": 32
 *                                    "name": "Elegant Granite Cheese"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 204166
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */
/**
 * @swagger
 * /api/v1/products/search:
 *  get:
 *      tags: ['Product']       
 *      summary: 'Get a products list which includes only those products which match the query parameter'  
 *      description: "Returns a list of five products sorted by page, starting with page 1 and returns 
 *       the previus and next page links according the page number you're currently on.  This request could be done by any user"
 *      parameters: 
 *          - $ref: '#/components/parameters/SearchByName'
 *          - $ref: '#/components/parameters/OrderBy'
 *          - $ref: '#/components/parameters/Order'
 *          - $ref: '#/components/parameters/Pagination'
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'
 *                              previosPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the previos page'
 *                              nextPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the next page'
 *                              count:
 *                                  type: integer
 *                                  description: 'The amount of product in the DB'                
 *                              products: 
 *                                  type: array
 *                                  description: array of products 
 *                                  items: 
 *                                      $ref: '#/components/schemas/Product'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/products/sear?page=1'
 *                              nextPage: '/api/v1/products?page=3'
 *                              count: 7              
 *                              products:
 *                                  - "id": 6
 *                                    "name": "Books"
 *                                    "description": "This product doesn't have a description"
 *                                    "price": 2320.53
 *                                    "seller_user_id": 36
 *                                    "category_id": 12
 *                                    "stock": 38
 *                                    "status": "active"
 *                                    "image":                
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "2022-10-14 18:53:36"
 *                                    "deletedAt": null
 *                                    "sales": 120451.78
 *                                  - "id": 7
 *                                    "description": "This product doesn't have a description"
 *                                    "price": 2320.53
 *                                    "seller_user_id": 36
 *                                    "category_id": 12
 *                                    "stock": 38
 *                                    "status": "active"
 *                                    "image":                
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "2022-10-14 18:53:36"
 *                                    "deletedAt": null
 *                                    "sales": 120451.78
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */
/**
 * @swagger
 * /api/v1/products/{id}:
 *  get:
 *      tags: ['Product']       
 *      summary: 'Get a product detail'  
 *      description: "It shows the asocciation with many other models. This request could be done by any user"
 *      parameters: 
 *          - $ref: '#/components/parameters/ID'
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'           
 *                              product: 
 *                                  $ref: '#/components/schemas/Product'    
 *                          example:
 *                              status: 200          
 *                              product:
 *                                  name: Modern Soft Shoes
 *                                  description: New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016
 *                                  price: 6928.19
 *                                  stock: 1
 *                                  status: active
 *                                  image: https://loremflickr.com/640/480/animals?2399
 *                                  total sales: 82199.98
 *                                  Category: 
 *                                      name: Beauty
 *                                  Seller: 
 *                                      first_name: Chad
 *                                      last_name: Legros
 *                                      email": cadlegrosgmail.com
 *                                  Transaction:
 *                                      - createdAt: 2022-05-04T20:03:50.000Z
 *                                        sale: 81299.98
 *                                        Buyer:
 *                                          first_name: Jeanne
 *                                          second_name: Mueller
 *                                          email: jeanmuller@gmail.com
 *                                        TransactionProduct:
 *                                          transaction_id: 12
 *                                          product_id: 66
 *                                          price: 2622.58
 *                                          quantity: 31
 *                                          createdAt: 2022-05-04T20:03:50.000Z
 *                                          updatedAt: 2022-05-04T20:03:50.000Z
 *                                          deletedAt: null
 *                                      - createdAt: 2022-08-09T20:03:50.000Z
 *                                        sale: 900
 *                                        Buyer:
 *                                          first_name: Matteo
 *                                          second_name: Stark
 *                                          email: matteostark@gmail.com
 *                                        TransactionProduct:
 *                                          transaction_id: 9
 *                                          product_id: 66
 *                                          price: 450
 *                                          quantity: 2
 *                                          createdAt: 2022-08-09T20:03:50.000Z
 *                                          updatedAt: 2022-08-09T20:03:50.000Z
 *                                          deletedAt: null
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */
/**
 * @swagger
 * /api/v1/me/products:
 *  get:
 *      tags: ['Product']       
 *      summary: 'Get a products list'  
 *      description: "Returns a list of five products sorted by page and sales, starting with page 1 and the top selling products, returns 
 *       the previus and next page links according the page number you're currently on. This request could be done by a seller user or the admin user"
 *      security:
 *          - apiKeyAuth: []
 *      parameters: 
 *          - $ref: '#/components/parameters/SellerId'
 *          - $ref: '#/components/parameters/Pagination'
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'
 *                              previosPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the previos page'
 *                              nextPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the next page'
 *                              count:
 *                                  type: integer
 *                                  description: 'The amount of products in the DB'                
 *                              products: 
 *                                  type: array
 *                                  description: array of products 
 *                                  items: 
 *                                      $ref: '#/components/schemas/Product'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/products?page=1'
 *                              nextPage: '/api/v1/products?page=3'
 *                              count: 20            
 *                              products:
 *                                  - "id": 57,
 *                                    "name": "Intelligent Granite Ball"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 300749.77
 *                                  - "id": 35,
 *                                    "name": "Refined Granite Computer"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 293194.05
 *                                  - "id": 91
 *                                    "name": "Practical Bronze Ball"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 274829.27
 *                                  - "id": 18
 *                                    "name": "Handcrafted Metal Salad"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 206864.82
 *                                  - "id": 32
 *                                    "name": "Elegant Granite Cheese"
 *                                    "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
 *                                    "price": 12531.24
 *                                    "seller_user_id": 16
 *                                    "category_id": 7
 *                                    "stock": 92
 *                                    "status": "active"
 *                                    "image": "https://loremflickr.com/640/480/animals?17692"
 *                                    "deletedAt": null
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                    "sales": 204166
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 *  post:
 *      tags: ['Product']       
 *      summary: 'Create a product'
 *      description: 'This request only could be done by a seller user'
 *      security:       
 *          - apiKeyAuth: []
 *      requestBody:    
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:                       
 *                          name:
 *                              type: string
 *                              example: 'Dulce de leche LA SERENISIMA estilo colonial 1 Kg'
 *                              description: 'unique in the DB'
 *                          description:
 *                              type: string
 *                              description: It could be sended empty and the server will use a default value
 *                              example: ""
 *                          price:
 *                              type: number
 *                              format: float
 *                              example: 700 
 *                          category_id:
 *                              type: integer
 *                              example: 10
 *                              description: category ID, must belong to existing category
 *                          stock:
 *                              type: integer
 *                              example: 15 
 *                          status:
 *                              type: string
 *                              example: active  
 *                              description: 'It could be active or inactive'
 *                          image:
 *                              type: string
 *                              format: binary
 *                      required:
 *                          - name
 *                          - price
 *                          - category_id
 *                          - stock
 *                          - status
 *                          - image
 *      responses:
 *          201: 
 *              description: Created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'
 *                                  example: 201
 *                              message:
 *                                  type: string
 *                                  description: 'successful result'
 *                                  example: 'product created'
 *                              product:
 *                                  $ref: '#/components/schemas/Product'                           
 *          400:
 *              $ref: '#/components/responses/BadRequest'
 *          401: 
 *              $ref: '#/components/responses/Unauthorized'
 *          403: 
 *              $ref: '#/components/responses/Forbbiden'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */
/**
 * @swagger
 * /api/v1/me/products/search:
 *  get:
 *      tags: ['Product']       
 *      summary: 'Get a products list which includes only those products which match the query parameter'  
 *      description: "Returns a list of five products sorted by page and sales, starting with page 1 and the top selling products, returns 
 *       the previus and next page links according the page number you're currently on. This request could be done by a seller user or the admin user"
 *      security:
 *          - apiKeyAuth: []
 *      parameters: 
 *          - $ref: '#/components/parameters/SellerId'
 *          - $ref: '#/components/parameters/SearchByName'
 *          - $ref: '#/components/parameters/OrderBy'
 *          - $ref: '#/components/parameters/Order'
 *          - $ref: '#/components/parameters/Pagination'
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'
 *                              previosPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the previos page'
 *                              nextPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the next page'
 *                              count:
 *                                  type: integer
 *                                  description: 'The amount of product in the DB'                
 *                              products: 
 *                                  type: array
 *                                  description: array of products 
 *                                  items: 
 *                                      $ref: '#/components/schemas/Product'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/me/products/sear?page=1'
 *                              nextPage: '/api/v1/me/products?page=2'
 *                              count: 7              
 *                              products:
 *                                  - "id": 6
 *                                    "name": "red T-shirt"
 *                                    "description": "This product doesn't have a description"
 *                                    "price": 2320.53
 *                                    "seller_user_id": 36
 *                                    "category_id": 12
 *                                    "stock": 38
 *                                    "status": "active"
 *                                    "image": https://ecommerce1287.s3.sa-east-1.amazonaws.com/product-img/product-1663617922368.jpg           
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "2022-10-14 18:53:36"
 *                                    "deletedAt": null
 *                                    "sales": 120451.78
 *                                  - "id": 7
 *                                    "name": "blue T-shirt"
 *                                    "description": "This product doesn't have a description"
 *                                    "price": 2320.53
 *                                    "seller_user_id": 36
 *                                    "category_id": 12
 *                                    "stock": 38
 *                                    "status": "active"
 *                                    "image": https://ecommerce1287.s3.sa-east-1.amazonaws.com/product-img/product-1663617922362.jpg               
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "2022-10-14 18:53:36"
 *                                    "deletedAt": null
 *                                    "sales": 120451.78
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          401: 
 *              $ref: '#/components/responses/BadRequest'
 *          403: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */

/**
 * @swagger
 * /api/v1/me/products/{id}:
 *  get:
 *      tags: ['Product']       
 *      summary: 'Get a product detail'  
 *      description: "It shows the asocciation with many other models. This request could be done by a seller user or the admin user"
 *      security:
 *          - apiKeyAuth: []
 *      parameters: 
 *          - $ref: '#/components/parameters/ID'
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'           
 *                              product: 
 *                                  $ref: '#/components/schemas/Product'    
 *                          example:
 *                              status: 200          
 *                              product:
 *                                  name: Modern Soft Shoes
 *                                  description: New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016
 *                                  price: 6928.19
 *                                  stock: 1
 *                                  status: active
 *                                  image: https://loremflickr.com/640/480/animals?2399
 *                                  total sales: 82199.98
 *                                  Category: 
 *                                      name: Beauty
 *                                  Seller: 
 *                                      first_name: Chad
 *                                      last_name: Legros
 *                                      email": cadlegrosgmail.com
 *                                  Transaction:
 *                                      - createdAt: 2022-05-04T20:03:50.000Z
 *                                        sale: 81299.98
 *                                        Buyer:
 *                                          first_name: Jeanne
 *                                          second_name: Mueller
 *                                          email: jeanmuller@gmail.com
 *                                        TransactionProduct:
 *                                          transaction_id: 12
 *                                          product_id: 66
 *                                          price: 2622.58
 *                                          quantity: 31
 *                                          createdAt: 2022-05-04T20:03:50.000Z
 *                                          updatedAt: 2022-05-04T20:03:50.000Z
 *                                          deletedAt: null
 *                                      - createdAt: 2022-08-09T20:03:50.000Z
 *                                        sale: 900
 *                                        Buyer:
 *                                          first_name: Matteo
 *                                          second_name: Stark
 *                                          email: matteostark@gmail.com
 *                                        TransactionProduct:
 *                                          transaction_id: 9
 *                                          product_id: 66
 *                                          price: 450
 *                                          quantity: 2
 *                                          createdAt: 2022-08-09T20:03:50.000Z
 *                                          updatedAt: 2022-08-09T20:03:50.000Z
 *                                          deletedAt: null
 *          401: 
 *              $ref: '#/components/responses/Unauthorized'
 *          403: 
 *              $ref: '#/components/responses/Forbbiden'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 *  put:
 *      tags: ['Product']       
 *      summary: 'Update a product'
 *      description: 'This request only could be done by a seller user'
 *      parameters:
 *          - $ref: '#/components/parameters/ID'
 *      security:
 *          - apiKeyAuth: []
 *      requestBody:    
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Product'
 *                  examples:
 *                      successful update:
 *                          value:
 *                              name: 'Dulce de leche LA SERENISIMA estilo colonial 1 Kg'
 *                              description: ""
 *                              price: 700
 *                              category_id: 10
 *                              stock: 15
 *                              status: active
 *                      unsuccessful update (update status):
 *                          value:
 *                              name: ""
 *                              description: "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas 'Letraset', las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum."
 *                              price: ""
 *                              category_id: ""
 *                              stock: ""
 *                              status: ""
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:                       
 *                          name:
 *                              type: string
 *                              example: 'Dulce de leche LA SERENISIMA estilo colonial 1 Kg'
 *                              description: 'unique in the DB'
 *                          description:
 *                              type: string
 *                              description: It could be sended empty and the server will use a default value
 *                              example: ""
 *                          price:
 *                              type: number
 *                              format: float
 *                              example: 700 
 *                          category_id:
 *                              type: integer
 *                              example: 10
 *                              description: category ID, must belong to existing category
 *                          stock:
 *                              type: integer
 *                              example: 15 
 *                          status:
 *                              type: string
 *                              example: active  
 *                              description: 'It could be active or inactive'
 *                          image:
 *                              type: string
 *                              format: binary      
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  description: 'successful result'
 *                                  example: 'product updated'
 *                              product:
 *                                  $ref: '#/components/schemas/Product'    
 *                                          
 *          400:
 *              $ref: '#/components/responses/BadRequest'
 *          401: 
 *              $ref: '#/components/responses/Unauthorized'
 *          403: 
 *              $ref: '#/components/responses/Forbbiden'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 *  delete:
 *      tags: ['Product']       
 *      summary: 'Delete a product'
 *      description: 'This request use the soft delete method and only could be done by a seller user'
 *      parameters: 
 *          - $ref: '#/components/parameters/ID'
 *      security:       
 *          - apiKeyAuth: [] 
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  description: 'Status code'
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  description: 'successful result'
 *                                  example: 'product deleted'  
 *          400:
 *              $ref: '#/components/responses/BadRequest'
 *          401: 
 *              $ref: '#/components/responses/Unauthorized'
 *          403: 
 *              $ref: '#/components/responses/Forbbiden'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */




