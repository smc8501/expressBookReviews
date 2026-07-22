const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const axios = require('axios');

let users = [];

const isValid = (username)=> { //returns boolean
//write code to check is the username is valid
  let filtered_users = users.filter((user) => user.username === username);
 
  return filtered_users.length > 0;

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  // Filter the users array to find a user with the matching username and password
  return users.some(
    user => 
      user.username === username && 
      user.password === password
  );
};

const  generateToken = (user) =>  {
  const payload = {
    username: user.username,
    password: user.password,
    
  };

  const options = {
    expiresIn: 60*60,
  };

  const accessToken = jwt.sign(payload, "29389128391283",options);

  return accessToken;
}
 
//only registered users can login
regd_users.post("/login", async (req,res) => {
  const { username, password } = req.body;
  const loginData = {username, password};
 

  try {
    if (!authenticatedUser(username, password)){
      return res.status(403).json({message: "User not authenticated"})
  }
    const user = users.find(user => user.username === username);

    const accessToken = generateToken(user);
  // Store token in session
    req.session.authorization = {
      accessToken
    };
    return res.status(200).json({message: "Login successful!"});
  } catch(error) {
    if (error.response) {
      return res.status(500).json({"Login Failed:": error.response.data.message});
    } else {
      return res.status(500).json({"Network/Server Error": error.message});
    }
  }

  
  

  

});


// Add a book review
regd_users.put("/auth/review/:isbn",  (req, res) => {
  const user_authed = req.user.username;
  const ISBN = req.params.isbn;
  let details = req.body.reviews;

  if (!books[ISBN]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
  const existingReview = books[ISBN].reviews.find(
    review => review.user === username
  );
  if (existingReview) {
    return res.status(400).json({
      message: "You have already reviwed this book"
    });
  }

  books[ISBN].reviews.push({user:user_authed, reviews:details});

  return res.status(201).json({message: "Review added successfully"})

  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user_authed = req.user.username;
  const ISBN = req.params.isbn;

  if (!books[ISBN]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
  const reviews  = books[ISBN].reviews;

  const reviewIndex = reviews.findIndex(
    review => review.user === user_authed
  );

  if (reviewIndex === -1) {
    return res.status(404).json({
      message: "Review not found"
    });
  }
  reviews.splice(reviewIndex, 1);

  return res.status(200).json({
    message: "Review deleted successfully"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
