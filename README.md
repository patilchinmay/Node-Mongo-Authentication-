# Node-Mongo-Authentication
===================================================

A user login-registration template using NodeJS, Express, BodyParser, Mongo, JWT.

Prerequisite:
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