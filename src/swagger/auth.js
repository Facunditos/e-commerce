/**
 *@swagger
 * components:
 *  schemas:
 *     User:
 *       type: object
 *       properties:
 *        id:
 *         type: integer                                  
 *        first_name:
 *         type: string
 *         minLength: 3 
 *        last_name:
 *         type: string
 *         minLength: 3
 *        email:
 *         type: string
 *         description: "The user's email has to be valid and unique in the DB" 
 *        password:
 *         type: string
 *         description: 'It should be a strong password: minLength: 6,minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 1. The server encrypt it' 
 *        role_id:
 *         type: integer
 *         minimum: 2
 *         maximum: 3
 *         description: 'role_id=2 (buyer) || role_id=3 (seller). In case the user signing up be part of the admin users list, the server changes the role to admin' 
 *        image:
 *         type: string
 *         format: binary
 *         description: 'In case the user does not upload an image, it will be assigned by default'     
 *        createdAt:
 *         type: string
 *         format: date-time
 *        updatedAt:
 *         type: string
 *         format: date-time
 *        deletedAt:
 *         type: string
 *         format: date-time 
 *         description: 'This attribute is necessary to use the soft delete method'
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - role_id   
 *       example:
 *          first_name: 'Facundo'
 *          last_name: 'López Crespo'
 *          email: 'facundolopezcrespo@hotmail.com'
 *          password: 'Facundo1234$'
 *          role_id: 2                            
 */

/**
 * @swagger
 * /api/v1/users/auth/register:
 *  post:
 *      tags: ['User']       
 *      summary: 'Create a user'
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
 *                      $ref: '#components/schemas/User' 
 *                  example:
 *                      successful sign up (admin user):
 *                          value:
 *                              "first_name": 'Admin'
 *                              "last_name": 'Admin'
 *                              "email": 'ecommerce1287@gmail.com'
 *                              "password": 'Admin1234$'
 *                              "role_id": 3
 *      responses:
 *          201: 
 *              description: User register 
 *          400: 
 *              description: Bad Request
 */
/**
 * @swagger
 * /api/v1/users/auth/login:
 *  post:
 *      tags: ['User']       
 *      summary: 'Sign in a user'
 *      requestBody:    
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *                  examples:
 *                      successful sign in:
 *                          value:
 *                              "email": 'facundolopezcrespo@hotmail.com'
 *                              "password": 'Facundo1234$'
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
 *              description: User logged in 
 *          400: 
 *              description: Bad Request
 *          404: 
 *              description: Not found 
 */