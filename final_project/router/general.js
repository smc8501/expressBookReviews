import { Router } from 'express';
import books from "./booksdb.js";
import { isValid } from "./auth_users.js";
import { users } from "./auth_users.js";
const public_users = Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});



// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  await res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const ISBN = req.params.isbn;
  await res.send(books[ISBN]);
  
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
  await res.send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
  await res.send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const ISBN = req.params.isbn;
  await res.send(books[ISBN].reviews);
});

export const general = public_users;
