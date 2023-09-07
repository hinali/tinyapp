const express = require("express");
const app = express();
//const cookieParser = require("cookie-parser"); 
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //middleware to parse the data 
//app.use(cookieParser());

function generateRandomString() {
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    const random = Math.floor(Math.random() * char.length);
    randomString += char[random];
  }
  console.log(randomString);
  return randomString;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:id", (req, res) => {
  const shortID = req.params.id;
  const longURL = urlDatabase[shortID];

  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Short urls not found");
  }
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const shortID = req.params.id;
  const templateVars = { id: shortID, longURL: urlDatabase[shortID] }
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  const shortID = req.params.id;

  if (urlDatabase[shortID]) {
    delete urlDatabase[shortID];
    res.redirect("/urls");
  } else {
    res.status(404).send("Short URL not found");
  }
});

app.post("/urls/:id/update", (req, res) => {
  const shortID = req.params.id;
  const longURL = req.body.updatedLongURL;
  console.log(shortID);

  if (urlDatabase[shortID]) {
    urlDatabase[shortID] = longURL;
    
    res.redirect("/urls");
  } else {
    res.status(404).send("Short URL not found");
  }
});

app.post("/login", (req, res)=>{
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});