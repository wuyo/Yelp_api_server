/*
 * API sub-router for businesses collection endpoints.
 */

const router = require('express').Router();

const { getUserRoleById } = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');
const { requireAuthentication } = require('../lib/auth');
const {
  AssignemntSchema,
  insertNewAssignemnt,
  getAssignemntById,
  replaceAssignemntById,
  deleteAssignemntById
} = require('../models/assignemnt');

/*
 * Route to create a new assignemnt.
 */
router.post('/', requireAuthentication, async (req, res) => {
  const user = getUserById(req.user);

  if (user.role === 'instructor' || req.admin) {
    if (validateAgainstSchema(req.body, AssignemntSchema)) {
      try {
        const id = await insertNewAssignemnt(req.body);
        res.status(201).send({
          id: id,
          links: {
            assignemnt: `/assignemnts/${id}`,
            business: `/courses/${req.body.courseId}`
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting assignemnt into DB.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid assignemnt object"
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

/*
 * Route to fetch info about a specific assignemnt.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const assignemnt = await getAssignemntById(parseInt(req.params.id));
    if (assignemnt) {
      res.status(200).send(assignemnt);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignemnt.  Please try again later."
    });
  }
});

/*
 * Route to update a assignemnt.
 */
router.put('/:id', requireAuthentication, async (req, res, next) => {
  if (req.body.userid == req.user || req.admin) {
    if (validateAgainstSchema(req.body, AssignemntSchema)) {
      try {
        /*
         * Make sure the updated assignemnt has the same courseID and userID as
         * the existing assignemnt.  If it doesn't, respond with a 403 error.  If the
         * assignemnt doesn't already exist, respond with a 404 error.
         */
        const id = parseInt(req.params.id);
        const existingAssignemnt = await getAssignemntById(id);
        if (existingAssignemnt) {
          if (req.body.courseId === existingAssignemnt.courseId && req.body.userid === existingAssignemnt.userid) {
            const updateSuccessful = await replaceAssignemntById(id, req.body);
            if (updateSuccessful) {
              res.status(200).send({
                links: {
                  business: `/courses/${req.body.courseId}`,
                  assignemnt: `/assignemnts/${id}`
                }
              });
            } else {
              next();
            }
          } else {
            res.status(403).send({
              error: "Updated assignemnt must have the same businessID and userID"
            });
          }
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to update assignemnt.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid assignemnt object."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

/*
 * Route to delete a assignemnt.
 */
router.delete('/:id', requireAuthentication, async (req, res, next) => {
  if (req.body.userid == req.user || req.admin) {
    try {
      const deleteSuccessful = await deleteAssignemntById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete assignemnt.  Please try again later."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

module.exports = router;
