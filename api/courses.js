/*
 * API sub-router for businesses collection endpoints.
 */

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { requireAuthentication } = require('../lib/auth');
const {
  CourseSchema,
  EnrollSchema,
  getcoursePage,
  insertCoursePage,
  getCoursePageById,
  updateCoursePageById,
  deleteCoursePageById,
} = require('../models/course');


/*
 * Route to return a paginated list of businesses.
 */
router.get('/', async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const coursePage = await getcoursePage(parseInt(req.query.page) || 1);
    coursePage.links = {};
    if (coursePage.page < coursePage.totalPages) {
      coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
      coursePage.links.lastPage = `/businesses?page=${coursePage.totalPages}`;
    }
    if (coursePage.page > 1) {
      coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
      coursePage.links.firstPage = '/courses?page=1';
    }
    res.status(200).send(coursePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching course list.  Please try again later."
    });
  }
});

/*
 * Route to create a new course.
 */
//router.post('/', requireAuthentication, async (req, res) => {
  //if (req.body.instructorId == req.user || req.admin) {
router.post('/', async (req, res) => {
  if(true){
    if (validateAgainstSchema(req.body, CourseSchema)) {
      try {
        const id = await insertCoursePage(req.body);
        res.status(201).send({
          id: id,
          links: {
            course: `/courses/${id}`
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting course into DB.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid course object."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

/*
 * Route to fetch info about a specific course.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const course = await getCoursePageById(parseInt(req.params.id));
    if (course) {
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch course.  Please try again later."
    });
  }
});

/*
 * Route to replace data for a course.
 */
// router.put('/:id', requireAuthentication, async (req, res, next) => {
//   if (req.body.userid == req.user || req.admin) {
router.put('/:id', async (req, res, next) => {
  if (true) {
    if (validateAgainstSchema(req.body, CourseSchema)) {
      try {
        const id = parseInt(req.params.id)
        const updateSuccessful = await updateCoursePageById(id, req.body);
        if (updateSuccessful) {
          res.status(200).send({
            links: {
              course: `/courses/${id}`
            }
          });
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to update specified course.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid course object"
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

/*
 * Route to delete a course.
 */
// router.delete('/:id', requireAuthentication, async (req, res, next) => {
//   if (req.body.userid == req.user || req.admin) {
 router.delete('/:id', async (req, res, next) => {
   if (true) {
    try {
      const deleteSuccessful = await deleteCoursePageById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete course.  Please try again later."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

module.exports = router;
