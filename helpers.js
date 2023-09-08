// Function to retrieve a user by their email from a database
function getUserByEmail(email, database) {
  for (const userId in database) {
    if (database[userId].email === email) {
      return userId;
    }
  }
  return undefined;
}

// Function to generate a random 6-character string
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
}

// Function to filter and return URLs associated with a specific user
function urlsForUser(id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
}

module.exports = { getUserByEmail, generateRandomString, urlsForUser };
