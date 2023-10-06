# Library-Management-System

Library Management System that allows users to manage books in a library. The system should include features such as user registration and authentication, book management (add, update, delete, list), book borrowing, searching for books, and a recommendation system.

## User Authentication API

### Overview

This API provides user registration and authentication functionality, allowing users to register new accounts and log in securely.

### Setup

1. Clone the repository: `(https://github.com/himanshu60/Library-Management-System)`
2. Install dependencies: `npm install`
3. Create a `.env` file with the required variables:

```
URL=your mongourl
PORT=port number
key=your_jwt_secret_key_here
```

4. Start the server: `npm start`

### Endpoints

#### User Registration

- **Route:** `POST user/register`
- **Description:** Register a new user with a unique email address.
- **Request Body:**

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "user_password"
}
```

- **Response:**

  - 201 Created: User registered successfully.
  - 400 Bad Request: User with the same email already exists.
  - 500 Internal Server Error: An error occurred during registration.

#### User Login

- **Route:** `POST user/login`
- **Description:** Log in an existing user with a valid email and password.
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "user_password"
}
```

- **Response:**

  - 200 OK: User login successful. Returns a JSON web token (JWT).
  - 401 Unauthorized: Wrong credentials or user not found.
  - 500 Internal Server Error: An error occurred during login.

### Dependencies

- bcrypt: Password hashing library.
- express: Web framework for Node.js.
- jsonwebtoken (JWT): Token-based authentication library.
- mongoose: MongoDB ODM (Object-Document Mapper).
- dotenv: Environment variable management.

### Usage

1. Register a new user by making a POST request to `user/register`.
2. Log in a user by making a POST request to `user/login`.
3. Use the returned JWT token for authenticated requests.


## Book Management API

### Overview

This API manages books in a library. It allows you to add, update, delete, list books, and handle book borrowing.

### Endpoints

#### Add Book Details

- **Route:** `POST book/addbook`
- **Description:** Add a new book to the library.
- **Request Body:**

```json
{
  "ISBN": "978-0451419439",
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "publishedYear": 1960,
  "quantity": 5
}
```

- **Response:**

  - 201 Created: Book added successfully.
  - 400 Bad Request: Book with the same ISBN already exists.
  - 500 Internal Server Error: An error occurred during book addition.

#### Update Book

- **Route:** `PATCH book/update/:ISBN`
- **Description:** Update book details by ISBN.
- **Request Body:**

```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "publishedYear": 2022,
  "quantity": 10
}
```

- **Response:**

  - 200 OK: Book details updated successfully.
  - 404 Not Found: Book not found.
  - 500 Internal Server Error: An error occurred during book update.

#### Delete Book

- **Route:** `DELETE book/delete/:ISBN`
- **Description:** Delete a book by ISBN.
- **Response:**

  - 200 OK: Book deleted successfully.
  - 404 Not Found: Book not found.
  - 500 Internal Server Error: An error occurred during book deletion.

#### List Books

- **Route:** `GET book/books`
- **Description:** Get a list of all books in the library.
- **Response:**

  - 200 OK: Returns a list of books.
  - 500 Internal Server Error: An error occurred during book retrieval.

#### Borrow Book

- **Route:** `POST book/borrow/:bookId`
- **Description:** Borrow a book.
- **Request Body:**

```json
{
  "userID": "user_id_here"
}
```

- **Response:**

  - 200 OK: Book borrowed successfully.
  - 400 Bad Request: User has already borrowed this book, book reached its maximum borrowing limit, or the book is not available.
  - 404 Not Found: Book not found.
  - 500 Internal Server Error: An error occurred during book borrowing.

### Dependencies

- express: Web framework for Node.js.
- mongoose: MongoDB ODM (Object-Document Mapper).

### Usage

1. Add a new book by making a POST request to `book/addbook`.
2. Update book details by making a PATCH request to `book/update/:ISBN`.
3. Delete a book by making a DELETE request to `book/delete/:ISBN`.
4. Get a list of all books by making a GET request to `book/books`.
5. Borrow a book by making a POST request to `book/borrow/:bookId`.

---
