const express = require('express');
const userDb = require('./userDb');
const postDb = require('../posts/postDb');
const router = express.Router();

//----------POST Requests----------//

//Creates new user
router.post('/', validateUser, (req, res) => {
  const userData = req.body;

  userDb.insert(userData)
    .then(user => {
      res.status(201).json({ message: "user added successfully" })
    })
    .catch(err => {
      console.log('error on POST /api/users', err);
      res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
});

//creates new post under a specific user
router.post('/:id/posts', validatePost, (req, res) => {
  const postData = req.body;

  postDb.insert(postData)
    .then(() => {
      res.status(201).json(postData)
    })
});

//----------GET Requests----------//

//gets list of all users
router.get('/', (req, res) => {
  userDb.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log('error on GET /api/users', err);
      res.status(500).json({ error: "The users information could not be retrieved." })
    });
});

//gets a specific user by their user id
router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;

  userDb.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(`error on GET /api/users/${id}`, err);
      res.status(500).json({ error: "The user information could not be retrieved." })
    });
});

//gets all posts for a specific user
router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;
  userDb.getUserPosts(id)
    .then(posts => {
      if (posts.length) {
        res.status(200).json(posts);
      } else {
        res.status(200).json({ message: "This user hasn't made any posts yet." })
      }
    })
});

//----------DELETE Requests----------//

//deletes a specific user
router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  userDb.remove(id)
    .then(() => {
      res.status(200).json({ message: 'User deleted successfully' })
    })
});

//----------PUT Requests----------//

//updates/makes changes to a specific user
router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  userDb.update(id, changes)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(`error on PUT /api/users/${id}`, err);
      res.status(500).json({ error: "The user information could not be updated." })
    })
});

//---------custom middleware---------//

//checks the given user id to make sure it exists in the database
function validateUserId(req, res, next) {
  const id = req.params.id;

  userDb.getById(id)
    .then(user => {
      if (user) {
        next();
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(err => {
      console.log(`error on GET /api/users/${id}`, err);
      res.status(500).json({ error: "The user information could not be retrieved." })
    });
}

//checks the body on a request to create a new user to ensure there is a body
function validateUser(req, res, next) {
  const userData = req.body;

  if (!userData.name) {
    res.status(400).json({ errorMessage: "Please provide a name for the user." })
  } else {
    next();
  }
}

//checks the body on a request to create a new post to ensure there is a body
function validatePost(req, res, next) {
  const id = req.params.id;
  const postData = req.body;

  userDb.getById(id)
    .then(user => {
      if (user) {
        if (!postData) {
          res.status(400).json({ message: "missing post data" })
        } else if (!postData.text) {
          res.status(400).json({ message: "missing required text field" })
        } else if (!postData.user_id) {
          res.status(400).json({ message: "missing required user_id field" })
        } else {
          next();
        }
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(err => {
      console.log(`error on GET /api/users/${id}`, err);
      res.status(500).json({ error: "The user information could not be retrieved." })
    });

}

module.exports = router;
