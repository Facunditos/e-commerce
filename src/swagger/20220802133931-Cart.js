/**
 *@swagger
 * components:
 *  schemas:
 *     ProductOnCart:
 *       type: object
 *       properties:
 *        id:
 *         type: integer      
 *         example: 2
 *        image:
 *         type: string
 *         format: binary
 *         example: 'https://ecommerce1287.s3.sa-east-1.amazonaws.com/cart-img/cart-1663617922362.jpg'                            
 *        name:
 *         type: string
 *         minLength: 3 
 *         example: 'Awesome Bronze Keyboard'
 *        price:
 *         type: string
 *         minimum: 0
 *         example: $ 150,20  
 *         description: The product on cart's price is edited
 *        quantity:
 *         type: string
 *         minimum: 1
 *         example: 5
 *        time:
 *         type: integer
 *         example: 1667246992102   
 *         description: The number of milliseconds since January 1, 1970 until the moment the product is added to the cart
 *        subtotal:
 *         type: number
 *         format: float
 *         example: 154563.85
 *         description: It is equal to price * quantity
 *       required:
 *         - id
 *         - image
 *         - name
 *         - price
 *         - quantity
 *         - time
 *         - subtotal
 *       example:
 *          id: 2
 *          image: 'https://ecommerce1287.s3.sa-east-1.amazonaws.com/cart-img/cart-1663617922362.jpg'
 *          name: 'Pelota Mundial De Fútbol Copa Del Mundo'
 *          price: $ 3573,63
 *          quantity: 2
 *          subtotal: $ 7147.26
 *     Cart:
 *      type: array
 *      items: 
 *          $ref: '#/components/schemas/ProductOnCart' 
 */


/**
 * @swagger
 * /api/v1/me/cart:
 *  get:
 *      tags: ['Cart']       
 *      summary: 'Get a carts list'  
 *      description: "Returns a list of five carts sorted by page and sales, starting with page 1 and the top selling carts, returns 
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
 *                                  description: 'The amount of carts in the DB'                
 *                              carts: 
 *                                  type: array
 *                                  description: array of carts 
 *                                  items: 
 *                                      $ref: '#/components/schemas/Cart'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/cart?page=1'
 *                              nextPage: '/api/v1/cart?page=3'
 *                              count: 20            
 *                              carts:
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
 * /api/v1/me/cart/{id}:
 *  get:
 *      tags: ['Cart']       
 *      summary: 'Get a cart detail'  
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
 *                              cart: 
 *                                  $ref: '#/components/schemas/Cart'    
 *                          example:
 *                              status: 200          
 *                              cart:
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
 *  post:
 *      tags: ['Cart']       
 *      summary: 'Add a product to the cart'
 *      description: 'This request only could be done by a buyer user'
 *      security:       
 *          - apiKeyAuth: []
 *      parameters:
 *         - $ref: '#/components/parameters/ID'
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
 *                                  example: 'product added'
 *                              cart:
 *                                  $ref: '#/components/schemas/Cart' 
 *                              worth:
 *                                  type: string
 *                                  description: It is the edited value of adding the items' subtotals
 *                                  example: $ 2.560,40 
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
 *  put:
 *      tags: ['Cart']       
 *      summary: 'Set up the quantity of the product on the cart'
 *      description: 'This request only could be done by a buyer user'
 *      parameters:
 *          - $ref: '#/components/parameters/ID'
 *      security:
 *          - apiKeyAuth: []
 *      requestBody:    
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Cart'
 *                  examples:
 *                      successful update:
 *                          value:
 *                              quantity: '3'
 *                      unsuccessful update (empty value):
 *                          value:
 *                              quantity: ""        
 *                      unsuccessful update (invalid value):
 *                          value:
 *                              quantity: -5   
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
 *                                  example: 'product on cart updated'
 *                              cart:
 *                                  $ref: '#/components/schemas/Cart'    
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
 *      tags: ['Cart']       
 *      summary: 'Delete a cart'
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
 *                                  example: 'cart deleted'  
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

/**
 * @swagger
 * /api/v1/me/cart/{id}/increase:
 *  put:
 *      tags: ['Cart']       
 *      summary: 'Increase by one the quantity of the product on the cart'
 *      description: 'This request only could be done by a buyer user'
 *      security:       
 *          - apiKeyAuth: []
 *      parameters:
 *         - $ref: '#/components/parameters/ID'
 *      responses:
 *          200: 
 *              description: Created
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
 *                                  example: 'product on cart updated'
 *                              cart:
 *                                  $ref: '#/components/schemas/Cart' 
 *                              worth:
 *                                  type: string
 *                                  description: It is the edited value of adding the items' subtotals
 *                                  example: $ 2.560,40 
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
/**
 * @swagger
 * /api/v1/me/cart/{id}/decrease:
 *  put:
 *      tags: ['Cart']       
 *      summary: 'Decrease by one the quantity of the product on the cart'
 *      description: 'This request only could be done by a buyer user'
 *      security:       
 *          - apiKeyAuth: []
 *      parameters:
 *         - $ref: '#/components/parameters/ID'
 *      responses:
 *          200: 
 *              description: Created
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
 *                                  example: 'product on cart updated'
 *                              cart:
 *                                  $ref: '#/components/schemas/Cart' 
 *                              worth:
 *                                  type: string
 *                                  description: It is the edited value of adding the items' subtotals
 *                                  example: $ 2.560,40 
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




