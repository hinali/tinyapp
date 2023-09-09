const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
const PORT = 8080;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Configure cookie sessions
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// Initialize urldatabase and users database
const urlDatabase = {};
const users = {};

// Home Page
app.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  } else {
    return res.redirect("/login");
  }
});

// Display user's URLs
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    const error = "You have to log in or register to access your URLs.";
    return res.status(401).send(`<html><body>${error}</body></html>`);
  }

  const user = users[userID];
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { user, urls: userUrls };
  return res.render("urls_index", templateVars);
});

// Display the "Create New URL" page
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  if (!user) {
    return res.redirect("/login");
  }

  const templateVars = { user };
  return res.render("urls_new", templateVars);
});

// Create a new short URL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  const user = users[userID];

  if (!user) {
    const error = "User needs to log in first to shorten URL";
    return res.send(`<html><body>${error}</body></html>`);
  }
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { longURL, userID };
  return res.redirect(`/urls/${shortURL}`);
});

// Redirect to the long URL when a short URL is accessed
app.get("/u/:id", (req, res) => {
  const shortID = req.params.id;
  const url = urlDatabase[shortID];

  if (url && url.longURL) {
    return res.redirect(url.longURL);
  } else {
    const error = "Short URL not found.";
    return res.status(404).send(`<html><body>${error}</body></html>`);
  }
});

// Display details of a specific URL
app.get("/urls/:id", (req, res) => {
  const shortID = req.params.id;
  const userID = req.session.user_id;
  const user = users[userID];
  const url = urlDatabase[shortID];

  if (!userID) {
    return res.status(401).send("Please log in to access this page.");
  }

  if (!url) {
    return res.status(404).send("Short URL not found.");
  }

  if (url.userID !== userID) {
    return res.status(403).send("You do not have access to this URL.");
  }

  const templateVars = { id: shortID, longURL: url.longURL, user };
  return res.render("urls_show", templateVars);
});

// Delete a URL
app.post("/urls/:id/delete", (req, res) => {
  const shortID = req.params.id;
  const userID = req.session.user_id;
  const url = urlDatabase[shortID];

  if (!userID) {
    return res.status(401).send("Please Login or Register");
  }

  if (!url) {
    return res.status(404).send("Short URL not found");
  }

  if (url.userID !== userID) {
    return res.status(403).send("You do not have access to delete this URL");
  }

  delete urlDatabase[shortID];
  return res.redirect("/urls");
});

// Update a URL
app.post("/urls/:id/update", (req, res) => {
  const shortID = req.params.id;
  const longURL = req.body.updatedLongURL;
  const userID = req.session.user_id;
  const url = urlDatabase[shortID];

  if (!userID) {
    return res.status(401).send("Please login or Register.");
  }

  if (!url) {
    return res.status(404).send("Short URL not found.");
  }

  if (url.userID !== userID) {
    return res.status(403).send("You do not have access to edit this URL");
  }

  urlDatabase[shortID].longURL = longURL;
  return res.redirect("/urls");
});

// Display the login page
app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];

  if (user) {
    return res.redirect("/urls");
  } else {
    const templateVars = { user };
    return res.render("login", templateVars);
  }
});

// Authenticate and log in the user
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const userID = getUserByEmail(email, users);
  let user = users[userID];

  if (!userID) {
    return res.status(403).send("User with that email not found");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Incorrect password");
  }

  req.session.user_id = user.id;
  return res.redirect("/urls");
});

// Display the registration page
app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];

  if (user) {
    return res.redirect("/urls");
  } else {
    const templateVars = { user };
    return res.render("register", templateVars);
  }
});

// Register a new user
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const user_Id = generateRandomString();

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  const existingUser = getUserByEmail(email, users);
  if (existingUser) {
    return res.status(400).send("Email already exists.");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: user_Id,
    email,
    password: hashedPassword
  };

  users[user_Id] = newUser;
  req.session.user_id = newUser.id;
  return res.redirect("/urls");
});

// Logout
app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
