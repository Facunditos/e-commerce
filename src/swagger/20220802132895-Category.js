/**
 *@swagger
 * components:
 *  schemas:
 *     Category:
 *       type: object
 *       properties:
 *        id:
 *         type: integer      
 *         example: 52                            
 *        name:
 *         type: string
 *         minLength: 3 
 *         example: 'Camping'
 *        description:
 *         type: string
 *         description: 'It could be sended empty and the server will use a default value'
 *         example: 'Repudiandae magnam nemo libero repellat eos voluptas neque. Iure nostrum ea. Assumenda consectetur est vero fuga eos velit veniam sapiente. Quisquam consectetur corrupti quibusdam voluptatem. Nisi unde consequatur illum suscipit voluptate in. Rerum itaque ut atque minus dolorum harum enim soluta a.'         
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
 *       example:
 *          id: 23
 *          name: 'Camping'
 *          description: 'Repudiandae magnam nemo libero repellat eos voluptas neque. Iure nostrum ea. Assumenda consectetur est vero fuga eos velit veniam sapiente. Quisquam consectetur corrupti quibusdam voluptatem. Nisi unde consequatur illum suscipit voluptate in. Rerum itaque ut atque minus dolorum harum enim soluta a.'
 *          createdAt: '2022-18-10 16:20:10'
 *          updatedAt: '2022-18-10 16:20:10'
 *          deletedAt: null
 */

/**
 * @swagger
 * /api/v1/categories:
 *  get:
 *      tags: ['Category']       
 *      summary: 'Get a categories list'  
 *      description: "Returns a list of five categories sorted by page, starting with page 1 and returns 
 *       the previus and next page links according the page number you're currently on.  This request could be done by any user"
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
 *                                  description: 'The amount of categories in the DB'                
 *                              categories: 
 *                                  type: array
 *                                  description: array of categories 
 *                                  items: 
 *                                      $ref: '#/components/schemas/Category'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/categories?page=1'
 *                              nextPage: '/api/v1/categories?page=3'
 *                              count: 20               
 *                              categories:
 *                                  - "id": 6
 *                                    "name": "Books"
 *                                    "description": "This category doesn't have a description"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 7
 *                                    "name": "Tools"
 *                                    "description": "Iusto et hic deleniti est voluptate. Accusamus sit at consequatur voluptatem dolorum voluptates quia. Natus vero exercitationem temporibus molestiae autem velit architecto. Est quae officiis temporibus ducimus saepe maxime facilis odio. Eius impedit ut sed dolore quisquam aliquid quis est."
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 8
 *                                    "name": "Sports"
 *                                    "description": "This category doesn't have a description"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 9
 *                                    "name": "Electronics"
 *                                    "description": "Provident hic ut.Minima nostrum voluptates.Sit perferendis sunt impedit odio repellendus et dolorem.Molestiae neque saepe praesentium atque quibusdam aspernatur voluptate.Eum fugiat ad est."
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 10
 *                                    "name": "Industrial"
 *                                    "description": "This category doesn't have a description"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"

 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 *  post:
 *      tags: ['Category']       
 *      summary: 'Create a category'
 *      description: 'This request only could be done by the admin'
 *      security:       
 *          - apiKeyAuth: []
 *      requestBody:    
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Category'
 *                  examples:
 *                      successful create:
 *                          value:
 *                              name: 'Camping'
 *                              description: 'Repudiandae magnam nemo libero repellat eos voluptas neque. Iure nostrum ea. Assumenda consectetur est vero fuga eos velit veniam sapiente. Quisquam consectetur corrupti quibusdam voluptatem. Nisi unde consequatur illum suscipit voluptate in. Rerum itaque ut atque minus dolorum harum enim soluta a.'
 *                      successful update without description:
 *                          value:
 *                              name: 'Boats'
 *                              description: ''
 *                      unsuccessful update (the category's name already exists):
 *                          value:
 *                              name: 'Boats'
 *                              description: ''
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
 *                                  example: 'category created'
 *                              category:
 *                                  $ref: '#/components/schemas/Category'                           
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
 * /api/v1/categories/search:
 *  get:
 *      tags: ['Category']       
 *      summary: 'Get a categories list which includes only those categories which match the query parameter'  
 *      description: "Returns a list of five categories sorted by page, starting with page 1 and returns 
 *       the previus and next page links according the page number you're currently on.  This request could be done by any user"
 *      parameters: 
 *          - $ref: '#/components/parameters/Pagination'
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            description: 'the past string is used to find specific categories whose name include it'
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
 *                                  description: 'The amount of categories in the DB'                
 *                              categories: 
 *                                  type: array
 *                                  description: array of categories 
 *                                  items: 
 *                                      $ref: '#/components/schemas/Category'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/categories/sear?page=1'
 *                              nextPage: '/api/v1/categories?page=3'
 *                              count: 7              
 *                              categories:
 *                                  - "id": 6
 *                                    "name": "Books"
 *                                    "description": "This category doesn't have a description"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 7
 *                                    "name": "Tools"
 *                                    "description": "Iusto et hic deleniti est voluptate. Accusamus sit at consequatur voluptatem dolorum voluptates quia. Natus vero exercitationem temporibus molestiae autem velit architecto. Est quae officiis temporibus ducimus saepe maxime facilis odio. Eius impedit ut sed dolore quisquam aliquid quis est."
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null" 
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *  get:
 *      tags: ['Category']       
 *      summary: 'Get a category detail'  
 *      description: "It shows the asocciation with Product model using where clause: status=active. This request could be done by any user"
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
 *                              category: 
 *                                  $ref: '#/components/schemas/Category'    
 *                          example:
 *                              status: 200          
 *                              category:
 *                                  "name": "Hoppe"
 *                                  "description": "Hoppe"
 *                                  "Products": 
 *                                      - name: 'Modern Soft Shoes'
 *                                        description: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016'
 *                                        price: 6928.19
 *                                        image: "https://loremflickr.com/640/480/animals?2399"
 *                                        Seller: 
 *                                           "first_name": "Chad"
 *                                           "last_name": "Legros"
 *                                           "email": "chadlegros@gmail.com"
 *                                           "image": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/185.jpg"      
 *                                      - name: 'Tasty Frozen Chairs'
 *                                        description: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016'
 *                                        price: 2708.34
 *                                        image: "https://loremflickr.com/640/480/animals?2399"
 *                                        Seller: 
 *                                           "first_name": "Hester"
 *                                           "last_name": "Muller"
 *                                           "email": "chadlegros@gmail.com"
 *                                           "image": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/185.jpg"                   
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
 *      tags: ['Category']       
 *      summary: 'Update a category'
 *      description: 'This request only could be done by the admin'
 *      parameters:
 *          - $ref: '#/components/parameters/ID'
 *      security:
 *          - apiKeyAuth: []
 *      requestBody:    
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Category'
 *                  examples:
 *                      successful update (add description):
 *                          value:
 *                              name: 'Boats'
 *                              description: 'Repudiandae magnam nemo libero repellat eos voluptas neque. Iure nostrum ea. Assumenda consectetur est vero fuga eos velit veniam sapiente. Quisquam consectetur corrupti quibusdam voluptatem. Nisi unde consequatur illum suscipit voluptate in. Rerum itaque ut atque minus dolorum harum enim soluta a.'
 *                      unsuccessful update (the name is short):
 *                          value:
 *                              name: 'Bo'
 *                              description: 'Repudiandae magnam nemo libero repellat eos voluptas neque. Iure nostrum ea. Assumenda consectetur est vero fuga eos velit veniam sapiente. Quisquam consectetur corrupti quibusdam voluptatem. Nisi unde consequatur illum suscipit voluptate in. Rerum itaque ut atque minus dolorum harum enim soluta a.'
 *                          
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
 *                                  example: 'category updated'
 *                              category:
 *                                  $ref: '#/components/schemas/Category'    
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
 *      tags: ['Category']       
 *      summary: 'Delete a category'
 *      description: 'This request use the soft delete method and only could be done by the admin'
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
 *                                  example: 'category deleted'  
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




