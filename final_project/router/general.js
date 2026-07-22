import { Router } from 'express';
import books from "./booksdb.js";
import { isValid } from "./auth_users.js";
import { users } from "./auth_users.js";
const public_users = Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  const registerPromise = new Promise((resolve, reject) => {
  if (!username && !password) {
    reject("Invalid username or password");
  }
  if (username && password) {
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      reject("Username already exists");
    } else {
      users.push({ username, password });
      resolve("User created successfully");
    }
}
});
  registerPromise
  .then((data) => {
    return res.status(200).json({message: "User registered successfully"})
  })
  .catch((error) => {
    return res.status(500).json({message: error})
  });
 });



// Get the book list available in the shop
public_users.get('/',  function (req, res) {
  const bookListPromise =  new Promise((resolve, reject) => {
    if (!books) {
      reject("No books found")
    } else {
      resolve(JSON.stringify(books))
    }
  })
  bookListPromise
  .then((data) => {
    return res.status(200).json({data})
  })
  .catch((error) => {
    return res.status(500).json({message: error})
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',  function (req, res) {
  const ISBN = req.params.isbn;
  
  const isbnPromise = new Promise((resolve, reject) => {
    if (!ISBN) {
      reject("No book found by that ISBN")
    } else {
      resolve(JSON.stringify(books[ISBN]))
    }
  });
  isbnPromise
  .then((data) => {
    return res.status(200).json({data})
  })
  .catch((error) => {
    return res.status(500).json({message: error})
  })
  
 });
  
// Get book details based on author
public_users.get('/author/:author',  function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
  
  const authorPromise = new Promise((resolve, reject) => {
    if (!filteredBooks) {
      reject("No Books found by that author")
    } else {
      resolve(JSON.stringify(filteredBooks))
    }
  });
  authorPromise
  .then((data) => {
    return res.status(200).json({data})
  })
  .catch((error) => {
    return res.status(500).json({message: error})
  })
});

// Get all books based on title
public_users.get('/title/:title',  function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
  
  const titlePromise = new Promise((resolve, reject) => {
    if (!filteredBooks) {
      reject("No books found by that title")
    } else {
      resolve(JSON.stringify(filteredBooks))
    }
  });
  titlePromise
  .then((data) => {
    return res.status(200).json({data})
  })
  .catch((error) => {
    return res.status(500).json({message: error})
  })
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const ISBN = req.params.isbn;
  
  const reviewISBNPromise = new Promise((resolve, reject) => {
    if (!ISBN) {
      reject("No book found by that ISBN")
    } else {
      resolve(JSON.stringify(books[ISBN].reviews))
    }
  });
  reviewISBNPromise
    .then((data) => {
    return res.status(200).json({data})
    })
    .catch((error) => {
    return res.status(500).json({message: error})
    })
});

export const general = public_users;
