# HotTakes

**Project 6 of the OC formation | Build an API </br>**

API Documentation is available here : [API doc](https://s3.eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P6/Requirements_DW_P6.pdf)


## :building_construction: Installation

- Clone this project from Github
- Make sur you have Node.js installed.

### :mag: Frontend

This project was generated with Angular CLI version 13.2.4.

- `cd ./FrontEnd`
- `npm install`
- Run `npm start` for a dev server. Navigate to `http://localhost:4200/` . The app will automatically reload if you change any of the source files.



### :mag: Backend


- `cd ./BackEnd`
- `npm install`
- `npm start` 

With nodemon the app will automatically reload if you change any of the source file.

After npm is done installing, set any environment variables in a .env file (in the folder BackEnd) , with this key :

```
# Port Use
PORT= xxx

# MongoDB client
MONGO_SECURE_URI = mongodb+srv://<user>:<password>@cluster0.csny7.mongodb.net/<nameDatabase>?retryWrites=true&w=majority

# Random secret token
JWT_KEY= xxx
``` 


## :hammer: Technology 
- Node.JS / Express / MongoDB
- Packages: Multer, JsonWebTokens, uniqueValidator, uuid, helmet, nodemon, dotenv & bcryp
