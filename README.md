# Node-Mongo-Authentication

A user login and registration template using NodeJS, Express, BodyParser, Mongo, JWT.

Prerequisites:
----------------------------------------

- NodeJS
- Mongo

Steps to run:
----------------------------------------

```
1. npm install
2. npm run
3. Browse to localhost:3000/ping
```

Notes:
-------------------------------------

- After running successfully, the project will automatically create a mongo database named **test** and create **users** collection in it.
- Import the postman collection from `postman` folder into your local postman and test user registration and login functionality.
- Credentials from `config/*` are being used in `app.js` and `application/components/users/user_controller.js`. While running it in production, please serve the credential through environment variable rather than these files as a security best practise.
- Path for registration api call: `localhost:3000/user/register`. 
- Path for login api call: `localhost:3000/user/login`. 
- Path for logged in (protected) api call: `localhost:3000/user/protected`.
- You have to add `Authorization` header for `protected` api call. The value of that header will be the token received in the response of login call.