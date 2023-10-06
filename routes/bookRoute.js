const express = require("express");
const bookRouter = express.Router();
const { bookModel } = require("../models/bookModel");
const { authenticate } = require("../middlewares/auth");

// add book details
bookRouter.post("/addbook", authenticate, async function createBook(req, res) {
  try {
    const { ISBN, title, author, publishedYear, quantity } = req.body;

    // Check if the ISBN already exists in the database
    const existingBook = await bookModel.findOne({ ISBN });

    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists." });
    }

    // Create a new book document
    const newBook = new bookModel({
      ISBN,
      title,
      author,
      publishedYear,
      quantity,
    });

    // Save the book document to the database
    await newBook.save();

    res.status(201).json({ message: "Book added successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// update bookdetails

bookRouter.patch("/update/:ISBN", async function updateBook(req, res) {
  try {
    const { ISBN } = req.params;
    const { title, author, publishedYear, quantity } = req.body;

    // Find the book by ISBN
    const book = await bookModel.findOne({ ISBN });

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Update the book details
    book.title = title || book.title;
    book.author = author || book.author;
    book.publishedYear = publishedYear || book.publishedYear;
    book.quantity = quantity || book.quantity;

    // Save the updated book document
    await book.save();

    res.status(200).json({ message: "Book details updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  detele book by id

bookRouter.delete("/delete/:ISBN", async function deleteBook(req, res) {
  try {
    const { ISBN } = req.params;

    // Find and delete the book by ISBN
    const deletedBook = await bookModel.findOneAndDelete({ ISBN });

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//   get all books

bookRouter.get("/books", async function listBooks(req, res) {
  try {
    // Find all books
    const books = await bookModel.find();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

bookRouter.post(
  "/borrow/:bookId",
  authenticate,
  async function borrowBook(req, res) {
    // Get the user ID from the auth middleware
    const userId = req.body.userID;

    const { bookId } = req.params;

    // Check if the user has already borrowed the book
    const book = await bookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const userIndex = book.borrowDetails.findIndex((detail) =>
      detail.user.equals(userId)
    );

    if (userIndex !== -1) {
      return res
        .status(400)
        .json({ message: "You have already borrowed this book." });
    }

    // Check if the book has reached its maximum borrowing limit
    if (book.borrowDetails.length >= 3) {
      return res
        .status(400)
        .json({
          message: "This book has reached its maximum borrowing limit.",
        });
    }

    // Check if the book is available (quantity > 0)
    if (book.quantity <= 0) {
      return res
        .status(400)
        .json({ message: "This book is currently not available." });
    }

    // Reduce the book's quantity by 1
    book.quantity -= 1;

    // Add the user's borrowing details to the `borrowDetails` array
    book.borrowDetails.push({
      user: userId,
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Assuming a 7-day borrowing period
    });

    await book.save();

    res.status(200).json({ message: "Book borrowed successfully." });
  }
);

module.exports = { bookRouter };
