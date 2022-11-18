/**
 *@swagger
 * components:
 *  schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *        id:
 *         type: integer      
 *         example: 2                            
 *        buyer_user_id:
 *         type: integer
 *         minimum: 1
 *         example: 40   
 *         description: buyer user ID, must belong to existing buyer user
 *        worth:
 *         type: number
 *         format: float
 *         description: add the subtotal (price*quantity) of each item of the transaction 
 *         example: 140.45
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
 *         - buyer_user_id
 *         - worth
 *       example:
 *          id: 2
 *          buyer_user_id: 2
 *          worth: 140.25
 *          createdAt: '2022-18-10 16:20:10'
 *          updatedAt: '2022-18-10 16:20:10'
 *          deletedAt: null
 */


/**
 * @swagger
 * /api/v1/me/transactions:
 *  get:
 *      tags: ['Transaction']       
 *      summary: 'Get a transactions list'  
 *      description: "Returns a list of five transactions sorted by page and created date, starting with page 1 and the last transactions, returns 
 *       the previus and next page links according the page number you're currently on. This request could be done by a buyer user or the admin user. In the first case, the list includes transactins wich the buyer is who makes the request. In the another case, the list includes all the transactions in the DB"
 *      security:
 *          - apiKeyAuth: []
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
 *                                  description: 'The amount of transactions in the DB'                
 *                              transactions: 
 *                                  type: array
 *                                  description: array of transactions 
 *                                  items: 
 *                                      $ref: '#/components/schemas/Transaction'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/me/transactions?page=1'
 *                              nextPage: '/api/v1/me/transactions?page=3'
 *                              count: 20            
 *                              transactions:
 *                                  - "id": 57,
 *                                    buyer_user_id: 45
 *                                    worth: 130478.23
 *                                    "createdAt": "2021-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2021-09-22T12:08:19.000Z"
 *                                  - "id": 57,
 *                                    buyer_user_id: 45
 *                                    worth: 230478.23
 *                                    "createdAt": "2020-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2020-09-22T12:08:19.000Z"
 *                                  - "id": 57,
 *                                    buyer_user_id: 45
 *                                    worth: 13.23
 *                                    "createdAt": "2019-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2019-09-22T12:08:19.000Z"
 *                                  - "id": 57,
 *                                    buyer_user_id: 45
 *                                    worth: 5130478.23
 *                                    "createdAt": "2015-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2015-09-22T12:08:19.000Z"
 *                                  - "id": 57,
 *                                    buyer_user_id: 45
 *                                    worth: 1304
 *                                    "createdAt": "2014-09-22T12:08:19.000Z"
 *                                    "updatedAt": "2014-09-22T12:08:19.000Z"
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
 * /api/v1/me/transactions/{id}:
 *  get:
 *      tags: ['Transaction']       
 *      summary: 'Get a transaction detail'  
 *      description: "It shows the asocciation with many other models. This request could be done by a buyer user or the admin user"
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
 *                              transaction: 
 *                                  $ref: '#/components/schemas/Transaction'    
 *                          example:
 *                              status: 200          
 *                              transaction:
 *                                  id: 1
 *                                  worth: 58824.4
 *                                  createdAt: "2022-03-19T10:14:34.000Z"
 *                                  Buyer: 
 *                                    first_name: "Eleanore"
 *                                    last_name: "McDermott"
 *                                    email: "eleanoremcdermott@gmail.com"
 *                                  Products: 
 *                                      - "id": 82
 *                                        "name": "Ergonomic Bronze Pizza"
 *                                        "subtotal": 58824.4
 *                                        "Seller": 
 *                                              "first_name": "Garth"
 *                                              "last_name": "Nikolaus"
 *                                              "email": "garthnikolaus@gmail.com"
 *                                        "Category": 
 *                                              "name": "new category name to id 10"
 *                                        "TransactionProduct": 
 *                                               "transaction_id": 1
 *                                               "product_id": 82
 *                                               "price": 2941.22
 *                                               "quantity": 20
 *                                               "deletedAt": null
 *                                               "createdAt": "2021-06-12T14:49:22.000Z"
 *                                               "updatedAt": "2021-06-12T14:49:22.000Z"
 *          401: 
 *              $ref: '#/components/responses/Unauthorized'
 *          403: 
 *              $ref: '#/components/responses/Forbbiden'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 *  delete:
 *      tags: ['Transaction']       
 *      summary: 'Delete a transaction'
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
 *                                  example: 'transaction deleted'  
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




