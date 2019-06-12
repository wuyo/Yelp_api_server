const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { UserSchema, insertNewUser, getUser, validateUser } = require('../models/user');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');

router.post('/', requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
    if(req.body.role === "admin" && (!req.admin)){
      res.status(403).send({
        error: "You are not the admin therfore you cant set as admin!"
      });
    } else {
      try {
        const id = await insertNewUser(req.body);
        res.status(201).send({
          _id: id
        });
      } catch (err) {
        console.error("  -- Error:", err);
        res.status(500).send({
          error: "Error inserting new user.  Try again later."
        });
      }
    }
  } else {
    res.status(400).send({
      error: "Request body does not contain a valid User."
    });
  }
});

router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const authenticated = await validateUser(req.body.email, req.body.password, true);
      if (authenticated) {
        const token = generateAuthToken(req.body.email);
        res.status(200).send({
          token: token
        });
      } else {
        res.status(401).send({
          error: "Invalid credentials"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Error validating user.  Try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body was invalid"
    });
  }
});

router.get('/:id', requireAuthentication, async (req, res, next) => {
  if (req.params.id == req.user || req.admin) {
    try {
      // const user = await getUserByEmail(parseInt(req.params.id));
      const user = await getUser(parseInt(req.params.id),null);
      if (user) {
        res.status(200).send(user);
      } else {
        next();
      }
    } catch (err) {
      console.error("  -- Error:", err);
      res.status(500).send({
        error: "Error fetching user.  Try again later."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

module.exports = router;
