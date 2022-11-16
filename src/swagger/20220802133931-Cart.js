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
 *         type: number
 *         format: float
 *         minimum: 0
 *         example: $ 150,20  
 *         description: The product on cart's price is edited
 *        quantity:
 *         type: integer
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
 *          name: Pelota Mundial De Fútbol Copa Del Mundo
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
 * /api/v1/me/cart/{id}:
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
 *                              quantity: 3
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
 *                              worth:
 *                                  type: string
 *                                  description: It is the edited value of adding the items' subtotals
 *                                  example: $ 2.560,40 
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
 *      summary: 'Remove a product from the cart'
 *      description: 'This request use the soft delete method and only could be done by a buyer user'
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
 *                                  example: 'product remove from cart'  
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
/**
 * @swagger
 * /api/v1/me/cart:
 *  get:
 *      tags: ['Cart']       
 *      summary: 'Get the cart'  
 *      description: "This request could be done by a buyer user and returns its cart"
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
 *                              cart:
 *                                  $ref: '#/components/schemas/Cart' 
 *                              worth:
 *                                  type: string
 *                                  description: It is the edited value of adding the items' subtotals
 *                                  example: $ 2.560,40 
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 *  delete:
 *      tags: ['Cart']       
 *      summary: 'Remove products from the cart'
 *      description: 'This request use the soft delete method and only could be done by a buyer user in order to empty the cart'
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
 *                                  example: 'The cart was emptied'  
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
 * /api/v1/me/cart/buy:
 *  post:
 *      tags: ['Cart']       
 *      summary: 'Make the transaction'
 *      description: 'This request only could be done by a buyer user'
 *      security:       
 *          - apiKeyAuth: []
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
 *                                  example: 'Transaction created'
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
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */



