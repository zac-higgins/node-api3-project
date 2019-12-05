const express = require('express');
const db = require('./userDb')
const router = express.Router();

//Creates new user
router.post('/', validateUser, (req, res) => {
  const userData = req.body;

  db.insert(userData)
    .then(user => {
      res.status(201).json({ message: "user added successfully" })
    })
    .catch(err => {
      console.log('error on POST /api/users', err);
      res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
});

//creates new post under a specific user
router.post('/:id/posts', (req, res) => {
});

//gets list of all users
router.get('/', (req, res) => {
  db.get()
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

  db.getById(id)
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
  db.getUserPosts(id)
    .then(posts => {
      if (posts.length) {
        res.status(200).json(posts);
      } else {
        res.status(200).json({ message: "This user hasn't made any posts yet." })
      }
    })
});

//deletes a specific user
router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(() => {
      res.status(200).json({ message: 'User deleted successfully' })
    })
});

//updates/makes changes to a specific user
router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;

  db.getById(id)
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

function validateUser(req, res, next) {
  const userData = req.body;

  if (!userData.name) {
    res.status(400).json({ errorMessage: "Please provide a name for the user." })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
