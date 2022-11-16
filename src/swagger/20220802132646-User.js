/**
 *@swagger
 * components:
 *  schemas:
 *     User:
 *       type: object
 *       properties:
 *        id:
 *         type: integer    
 *         example: 52                              
 *        first_name:
 *         type: string
 *         minLength: 3 
 *         example: 'Facundo'
 *        last_name:
 *         type: string
 *         minLength: 3
 *         example: 'López Crespo'     
 *        email:
 *         type: string
 *         format: email
 *         description: "The user's email has to be valid and unique in the DB" 
 *         example: 'facundoloprezcrespo@hotmail.com'
 *        password:
 *         type: string
 *         description: 'It should be a strong password: minLength: 6,minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 1. The server encrypt it' 
 *         example: 'Facundo1234$'
 *        role_id:
 *         type: integer
 *         minimum: 2
 *         maximum: 3
 *         description: 'role ID: 2=buyer || 3=seller. In case the user signing up be part of the admin users list, the server changes the role_id to 1 (admin)' 
 *         example: 2
 *        image:
 *         type: string
 *         format: binary
 *         description: "In case the user upload an image, this will be storage in the AWS S3's bucket, if the user does not, this will be assigned by default"
 *         example: 'https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png'
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
 *         example: '2022-18-10 16:20:10'
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - role_id   
 *       example:
 *          id: 52
 *          first_name: 'Facundo'
 *          last_name: 'López Crespo'
 *          email: 'facundolopezcrespo@hotmail.com'
 *          password: '$10$y4xEtOQovjaXP4gWojrf7uTExKk3BvVxDBP1two.aVrKGfftAflfa'
 *          role_id: 2  
 *          image: 'https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png'
 *          createdAt: '2022-18-10 16:20:10'
 *          updatedAt: '2022-18-10 16:20:10'
 *          deletedAt: null
 */

/**
 * @swagger
 * /api/v1/users/auth/register:
 *  post:
 *      tags: ['User']       
 *      summary: 'Create a user'
 *      description: The server send a welcome email to the new user
 *      requestBody:    
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *                  examples:
 *                      successful sign up (admin user):
 *                          value:
 *                              "first_name": 'Admin'
 *                              "last_name": 'Admin'
 *                              "email": 'ecommerce1287@gmail.com'
 *                              "password": 'Admin1234$'
 *                              "role_id": 3
 *                      successful sign up (buyer user):
 *                          value:
 *                              "first_name": 'Facundo'
 *                              "last_name": 'López Crespo'
 *                              "email": 'facundolopezcrespo@hotmail.com'
 *                              "password": 'Facundo1234$'
 *                              "role_id": 2
 *                      successful sign up (seller user):
 *                          value:
 *                              "first_name": 'Juana'
 *                              "last_name": 'Azurduy'
 *                              "email": 'juanaazurduy@gmail.com'
 *                              "password": 'Juana1234$'
 *                              "role_id": 3
 *                      unsuccessful sign up (the body is empty):
 *                          value:
 *                              "first_name": "" 
 *                              "last_name": "" 
 *                              "email": "" 
 *                              "password": "" 
 *                              "role_id": "" 
 *                      unsuccessful sign up (the user already exits):
 *                          value:
 *                              "first_name": 'Facundo'
 *                              "last_name": 'López Crespo'
 *                              "email": 'facundolopezcrespo@hotmail.com'
 *                              "password": 'Facundo1234$'
 *                              "role_id": 2
 *                      unsuccessful sign up (the password is not strong):
 *                          value:
 *                              "first_name": 'Facundo'
 *                              "last_name": 'López Crespo'
 *                              "email": 'facundolopezcrespo302@gmail.com'
 *                              "password": 'Facundo1234'
 *                              "role_id": 3         
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:                       
 *                          first_name:
 *                              type: string
 *                              example: 'Facundo'
 *                          last_name:
 *                              type: string
 *                              example: 'López Crespo'
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: 'facundolopezcrespo@hotmail.com'
 *                          password:
 *                              type: string
 *                              example: Facundo1234$
 *                          role_id:
 *                              type: integer
 *                              example: 2
 *                          image:
 *                              type: string
 *                              format: binary
 *                      required:
 *                          - first_name
 *                          - last_name
 *                          - email
 *                          - password
 *                          - role_id
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
 *                                  example: 'user created'
 *                              user:
 *                                  $ref: '#/components/schemas/User'    
 *                                          
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */
/**
 * @swagger
 * /api/v1/users/auth/login:
 *  post:
 *      tags: ['User']       
 *      summary: 'Sign in a user'
 *      description: The server provide a token to the user logged in 
 *      requestBody:    
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *                  examples:
 *                      successful sign in (admin user):
 *                          value:
 *                              "email": 'ecommerce1287@gmail.com'
 *                              "password": 'Admin1234$'
 *                      successful sign in (buyer user):
 *                          value:
 *                              "email": 'facundolopezcrespo@hotmail.com'
 *                              "password": 'Facundo1234$'
 *                      successful sign in (seller user):
 *                          value:
 *                              "email": 'juanaazurduy@gmail.com'
 *                              "password": 'Juana1234$'                
 *                      unsuccessful sign in (the email is not valid and the password is not strong):
 *                          value:
 *                              "email": "facundolopezpo@" 
 *                              "password": "facundo1234$"
 *                      unsuccessful sign in (the email does not match):
 *                          value:
 *                              "email": "facundolopez@hotmail.com" 
 *                              "password": "Facundo1234$"
 *                      unsuccessful sign in (the password does not match):
 *                          value:
 *                              "email": "facundolopezcrespo@hotmail.com" 
 *                              "password": "Facu1234$"   
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
 *                                  example: 'user logged in'
 *                              user:
 *                                  $ref: '#/components/schemas/User'
 *                              token: 
 *                                  type: string
 *                                  descrption: 'This token should be part of the header request in all authentication routes'
 *                                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjo1MSwiZmlyc3RfbmFtZSI6IkFkbWluIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImVjb21tZXJjZTEyODdAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkVzF4M1pmUDl3Rm9qYlVzeHRwZE5KLmYySWE4Lk5MLjhsbjEwS3FMZ1JPbVRPNDdNd08xSDIiLCJyb2xlX2lkIjoxLCJpbWFnZSI6Imh0dHBzOi8vZWNvbW1lcmNlMTI4Ny5zMy5zYS1lYXN0LTEuYW1hem9uYXdzLmNvbS91c2VyLWltZy91c2VyLWFub255bW91cy5wbmciLCJkZWxldGVkQXQiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMTAtMTRUMTg6NTM6MTguMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMTAtMTRUMTg6NTM6MTguMDAwWiIsIkJ1eXMiOltdLCJQcm9kdWN0c09uU2FsZSI6W10sIlJvbGUiOnsiaWQiOjEsIm5hbWUiOiJBZG1pbiIsImRlc2NyaXB0aW9uIjoiVGhpcyByb2xlIGRvZXNuJ3QgaGF2ZSBhIGRlc2NyaXB0aW9uIiwiZGVsZXRlZEF0IjpudWxsLCJjcmVhdGVkQXQiOiIyMDE3LTAxLTE1VDExOjMwOjQ1LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDE3LTAxLTE1VDExOjMwOjQ1LjAwMFoifX0sImlhdCI6MTY2NjA5NjQ3MywiZXhwIjoxNjY2MTI1MjczfQ.sVF3hZfo689S6gvnsqT5cSL8VHh3U1L4paR2QVsdabQ'                                   
 *          400: 
 *              $ref: '#/components/responses/BadRequest'
 *          404: 
 *              $ref: '#/components/responses/NotFound'
 *          500: 
 *              $ref: '#/components/responses/ErrorServer'
 */
/**
 * @swagger
 * /api/v1/users:
 *  get:
 *      tags: ['User']       
 *      summary: 'Get a users list'  
 *      description: "Returns a list of five users sorted by page, starting with page 1 and returns 
 *       the previus and next page links according the page number you're currently on.  This request only could be done by the admin"
 *      parameters: 
 *          - $ref: '#/components/parameters/Pagination'
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
 *                              previosPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the previos page'
 *                              nextPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the next page'
 *                              count:
 *                                  type: integer
 *                                  description: 'The amount of users in the DB'                
 *                              users: 
 *                                  type: array
 *                                  description: array of users 
 *                                  items: 
 *                                      $ref: '#/components/schemas/User'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/users?page=1'
 *                              nextPage: '/api/v1/users?page=3'
 *                              count: 55               
 *                              users:
 *                                  - "id": 6
 *                                    "first_name": "Korbin"
 *                                    "last_name": "Hoppe"
 *                                    "email": "korbinhoppe@gmail.com"
 *                                    "role_id": "3"
 *                                    "image": "https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 7
 *                                    "first_name": "Robbie"
 *                                    "last_name": "Runolfsson"
 *                                    "email": "robbierunolfsson@gmail.com"
 *                                    "role_id": "2"
 *                                    "image": "https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 8
 *                                    "first_name": "Robbie"
 *                                    "last_name": "Runolfsson"
 *                                    "email": "robbierunolfsson@gmail.com"
 *                                    "role_id": "2"
 *                                    "image": "https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 9
 *                                    "first_name": "Darrick"
 *                                    "last_name": "Leffler"
 *                                    "email": "darrickleffler@gmail.com"
 *                                    "role_id": "2"
 *                                    "image": "https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 10
 *                                    "first_name": "Jazmyne"
 *                                    "last_name": "Orn"
 *                                    "email": "jazmyneorn@gmail.com"
 *                                    "role_id": "2"
 *                                    "image": "https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
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
 */
/**
 * @swagger
 * /api/v1/users/search:
 *  get:
 *      tags: ['User']       
 *      summary: 'Get a users list which includes only those users whose email match the query parameter'  
 *      description: "Returns a list of five users sorted by page, starting with page 1 and returns 
 *       the previus and next page links according the page number you're currently on.  This request only could be done by the admin"
 *      parameters: 
 *          - $ref: '#/components/parameters/Pagination'
 *          - in: query
 *            name: email
 *            schema:
 *              type: string
 *            description: 'the past string is used to find specific users whose emails include it'
 *                
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
 *                              previosPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the previos page'
 *                              nextPage:
 *                                  type: string
 *                                  description: 'The url necessary to view the next page'
 *                              count:
 *                                  type: integer
 *                                  description: 'The amount of users in the DB'                
 *                              users: 
 *                                  type: array
 *                                  description: array of users 
 *                                  items: 
 *                                      $ref: '#/components/schemas/User'    
 *                          example:
 *                              status: 200
 *                              previosPage: '/api/v1/users/sear?page=1'
 *                              nextPage: '/api/v1/users?page=3'
 *                              count: 7              
 *                              users:
 *                                  - "id": 6
 *                                    "first_name": "Korbin"
 *                                    "last_name": "Hoppe"
 *                                    "email": "korbinhoppe@gamil.com"
 *                                    "role_id": "3"
 *                                    "image": "https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
 *                                  - "id": 7
 *                                    "first_name": "Robbie"
 *                                    "last_name": "Runolfsson"
 *                                    "email": "robbierunolfsson@gmail.com"
 *                                    "role_id": "2"
 *                                    "image": "https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png"
 *                                    "deletedAt": "2022-10-14 18:53:36"
 *                                    "createdAt": "2022-10-14 18:53:36"
 *                                    "updatedAt": "null"
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
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *  get:
 *      tags: ['User']       
 *      summary: 'Get a user detail'  
 *      description: 'It shows asocciation with others classes. This request only could be done by the admin or the user whose id is includes as path parameter'
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
 *                              user: 
 *                                  $ref: '#/components/schemas/User'    
 *                          example:
 *                              status: 200          
 *                              user:
 *                                  "id": 6
 *                                  "first_name": "Korbin"
 *                                  "last_name": "Hoppe"
 *                                  "email": "korbinhoppe@gmail.com"
 *                                  "role_id": "3"
 *                                  "image": "https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png"
 *                                  "deletedAt": "2022-10-14 18:53:36"
 *                                  "createdAt": "2022-10-14 18:53:36"
 *                                  "updatedAt": "null"                        
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
 *      tags: ['User']       
 *      summary: 'Update a user'
 *      description: 'This request only could be done by the the user whose id is includes as path parameter'
 *      parameters: 
 *          - $ref: '#/components/parameters/ID'
 *      security:       
 *          - apiKeyAuth: []
 *      requestBody:    
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *                  examples:
 *                      successful update (new password):
 *                          value:
 *                              "first_name": 'Facundo'
 *                              "last_name": 'López Crespo'
 *                              "email": 'facundolopezcrespo@hotmail.com'
 *                              "password": 'Facundo0301$'
 *                      unsuccessful update (the password is not strong):
 *                          value:
 *                              "first_name": 'Facundo'
 *                              "last_name": 'López Crespo'
 *                              "email": 'facundolopezcrespo@hotmail.com'
 *                              "password": 'Facundo0301' 
 *                      successful update (new email):
 *                          value:
 *                              "first_name": 'Facundo'
 *                              "last_name": 'López Crespo'
 *                              "email": 'facundolopezcrespo302@gmail.com'
 *                              "password": 'Facundo0301$'
 *                      unsuccessful update (the email already exits):
 *                          value:
 *                              "first_name": 'Facundo'
 *                              "last_name": 'López Crespo'
 *                              "email": 'juanaazurduy@gmail.com'
 *                              "password": 'Facundo0301$'    
 *                      unsuccessful update (error 403:the user does not have permission):
 *                          value:
 *                              "first_name": 'Facundo'
 *                              "last_name": 'López Crespo'
 *                              "email": 'facundolopezcrespo@hotmail.com'
 *                              "password": 'Facundo0301$'      
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:                       
 *                          first_name:
 *                              type: string
 *                              example: 'Facundo'
 *                          last_name:
 *                              type: string
 *                              example: 'López Crespo'
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: 'facundolopezcrespo@hotmail.com'
 *                          password:
 *                              type: string
 *                              example: Facundo1234$
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
 *                                  example: 'user updated'
 *                              user:
 *                                  $ref: '#/components/schemas/User'    
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
 *      tags: ['User']       
 *      summary: 'Delete a user'
 *      description: 'This request use the soft delete method and only could be done by the the user whose id is includes as path parameter'
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
 *                                  example: 'user deleted'  
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




