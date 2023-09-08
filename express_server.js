const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helper');
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //middleware to parse the data 
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    const error = "You have to log in or register to access your URLs.";
    return res.status(401).send(`<html><body>${error}</body></html>`);
  }

  const user = users[userID];
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { user, urls: userUrls };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  const user = users[userID];

  if (!user) {
    const error = "User need to login first to shorten URL";
    return res.send(`<html><body>${error}</body></html>`);
  }
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:id", (req, res) => {
  const shortID = req.params.id;
  const longURL = urlDatabase[shortID];

  if (longURL) {
    // Redirect when the ID exists in the database.
    res.redirect(longURL);
  } else {
    // when ID does not exist in the database.
    const error = "Short URL not found.";
    res.status(404).send(`<html><body>${error}</body></html>`);
  }
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  if (!user) {
    return res.redirect("/login");
  }

  const templateVars = { user };
  return res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const shortID = req.params.id;
  const userID = req.session.user_id;
  const user = users[userID];
  const url = urlDatabase[shortID];

  if (!user) {
    // If the user is not logged in,return error
    return res.status(401).send("Please log in to access this page.");
  }

  if (!url) {
    // If the URL does not exist, return error
    return res.status(404).send("Short URL not found.");
  }

  if (url.userID !== userID) {
    // If the URL does not belong to the user, return an error 
    return res.status(403).send("You do not have access to this URL.");
  }

  const templateVars = { id: shortID, longURL: url.longURL, user };
  return res.render("urls_show", templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  const shortID = req.params.id;
  const userID = req.session.user_id;
  const url = urlDatabase[shortID];

  if (!userID) {
    return res.status(401).send("Please Login or Register")
  }

  if (!url) {
    return res.status(404).send("Short URL not found");
  }

  if (url.userID !== userID) {
    return res.status(403).send("you do not have access to delete this URL")
  }

  delete urlDatabase[shortID];
  res.redirect("/urls");

});

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
    return res.status(403).send("you do not have access to delete this URL");
  }

  urlDatabase[shortID].longURL = longURL;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];

  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = { user };
    res.render("login", templateVars);
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);

  if (!user) {
    return res.status(403).send("User with that email not found");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Incorrect password");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");

});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];

  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = { user };
    res.render("register", templateVars);
  }
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const user_Id = generateRandomString();

  // filter for either email or password is an empty string
  if (!email || !password) {
    res.status(400).send("Email and password are required.");
    return;
  }
  // filter for the email already exists in the users object
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    res.status(400).send("Email already exists.");
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: user_Id,
    email,
    password: hashedPassword
  };

  users[user_Id] = newUser;// Add the new user to the users object
  req.session.user_id = newUser.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});