const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

// Sample user data for testing
const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID); // Assertion: user should match expectedUserID
  });

  it('should return undefined for an email not in the database', function() {
    const user = getUserByEmail("Invalidemail@example.com", testUsers);
    assert.isUndefined(user); // Assertion: user should be undefined
  });
});
