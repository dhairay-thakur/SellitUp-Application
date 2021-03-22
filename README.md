# SellitUp-Application - backend
- This repo contains the backend and APIs for the sell-it-up application, where users can sell off the products they don't need anymore
- Built using nodeJs and expressJs, along with MongoDB as the associated database
- File Upload - Users can also upload images to the server, `multer` has been used to implement this feature
- Authentication - Users can login and signup, the passwords are stored in the database in a hashed format, accomplished using `bcryptJs`
- Authorization - All major requests to the server, send response only after the json web token is authorized. Each user is assigned a jwt upon successful login.
- Comprehensive error handling for edge cases 
- Modularized code structure, with all the business logic being separated from the routes

The frontend for this application, built using React Native, can be found [here](https://github.com/dhairay-thakur/SellItUp-Application---Frontend/)
