/*
 * API sub-router for businesses collection endpoints.
 */

const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
var path = require('path');

var time = require('express-timestamp')

const { getUserRoleById } = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');
const { requireAuthentication } = require('../lib/auth');
const { getCoursePageById } = require('../models/course')
const {
  AssignmentSchema,
  AssignmentPatchSchema,
  insertNewAssignment,
  insertNewSubmission,
  getAssignmentById,
  getSubmissionById,
  updateAssignmentById,
  deleteAssignmentById
} = require('../models/assignment');

/*
 * Route to submit a new assignment.
 */
 const submit = multer({
   storage: multer.diskStorage({
     desination: `${__dirname}/submissions`,
     filename: (req, file, callback) => {
       const basename = crypto.pseudoRandomBytes(16).toString('hex');
       console.log(file.originalname);
       // const extension = file.mimetype;
       const extension = path.extname(file.originalname)
       callback(null, `${basename}${extension}`)
     }
   })
 })

function removeUploadedFile(file) {
 return new Promise((resolve, reject) => {
   fs.unlink(file.path, (err) => {
     if (err) {
       reject(err);
     } else {
       resolve();
     }
   });
 });
}

router.post('/:id/submissions', submit.single('submit'), requireAuthentication, async (req, res, next) => {
 var d = new Date();
 const assign = await getAssignmentById(req.params.id);
if (assign){
  const course = await getCoursePageById(parseInt(assign.courseId));
  if ((req.role === 'student') && (req.user == req.body.studentid) || req.admin){
 // console.log("body: ", req.body);
    if (req.file && req.body && req.body.assignmentid){
      try {
        console.log("file path is: ", req.file.path);
        const assignment = {
          assignmentid: req.body.assignmentid,
          studentid: req.body.studentid,
          path: req.file.path,
          filename: req.file.filename,
          timestamp: d.toISOString()
        };
        const id = await insertNewSubmission(assignment);
        await removeUploadedFile(req.file);

        res.status(201).send({
          success: "New Submission successfully added",
          id: id
        });
      } catch (err) {
        next(err);
      }
    } else {
      res.status(400).send({
        err: "Request body was invalid. "
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
} else {
  res.status(404).send({
    error: "No specific assignment"
  });
}

});

/*
 * Route to fetch info about submission of a specific assignment
 */
router.get('/:id/submissions', requireAuthentication, async (req, res, next) => {
  const assign = await getAssignmentById(req.params.id);
   if (assign){
     const course = await getCoursePageById(parseInt(assign.courseId));
     if ((req.role === 'instructor' && req.user == course.instructorId) || req.admin) {
        try {
      // const assign = await getAssignmentById(req.params.id);
      // console.log(assign);
      // if(assign){
        // console.log(parseInt(assign.studentid));
          const submit = await getSubmissionById(req.params.id, req.query.page || 1, req.query.studentid);
          console.log("submit is:",submit);
          if (submit) {
          // const responseBody = {
          //   assignmentid: submit.metadata.assignmentid,
          //   studentid: submit.metadata.studentid,
          //   timestamp: submit.metadata.timestamp,
          //   file: submit.filename
          // };
            res.status(200).send(submit);
          } else {
            next();
          }
      // }
    } catch (err) {
      next(err);
    }
  } else {
     res.status(403).send({
       error: "Unauthorized to access the specified resource"
     });
   }
 } else {
   res.status(404).send({
     error: "No specific assignment"
   });
 }
});



/*
 * Route to create a new assignment.
 */
router.post('/', requireAuthentication, async (req, res) => {
  const course = await getCoursePageById(parseInt(req.body.courseId));
  if (course){
    if ((req.role === 'instructor' && req.user == course.instructorId) || req.admin) {
      if (validateAgainstSchema(req.body, AssignmentSchema)) {
        try {
          const id = await insertNewAssignment(req.body);
          res.status(201).send({
            success: "New Assignment successfully added",
            _id: id
          });
        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Error inserting assignment into DB.  Please try again later."
          });
        }
      } else {
        res.status(400).send({
          error: "Request body is not a valid assignment object"
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
  } else {
    res.status(404).send({
      error: "No specific course id"
    });
  }
});

/*
 * Route to fetch info about a specific assignment.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const assignment = await getAssignmentById(req.params.id);
    if (assignment) {
      newDate = new Date(JSON.parse(JSON.stringify(assignment.due)));
      assignment.due = newDate;
      console.log(assignment);
      res.status(200).send(assignment);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignment.  Please try again later."
    });
  }
});

/*
 * Route to update a assignment.
 */
 router.patch('/:id', requireAuthentication, async (req, res, next) => {
   const assign = await getAssignmentById(req.params.id);
   if(assign){
     const course = await getCoursePageById(parseInt(assign.courseId));
     if ((req.role === 'instructor' && req.user == course.instructorId) || req.admin) {
       if (validateAgainstSchema(req.body, AssignmentPatchSchema)) {
         try {
           const id = await updateAssignmentById(req.params.id, req.body);
           console.log(id);
           if(id){
             res.status(201).send({
               success: "success",
               id: req.params.id
             });
           }
         } catch (err) {
           console.log(err);
           res.status(404).send({
             error: "Error update assignment into DB.  Please try again later."
           });
         }
       } else {
         res.status(400).send({
           error: "The request body was either not present or did not contain any fields related to Assignment objects."
         });
       }
     } else {
       res.status(403).send({
         error: "Unauthorized to access the specified resource"
       });
     }
   } else {
     res.status(403).send({
       error: "No specific assignemnt id"
    });
   }
 });

/*
 * Route to delete a assignment.
 */
router.delete('/:id', requireAuthentication, async (req, res, next) => {
  const assign = await getAssignmentById(req.params.id);
  if(assign){
    const course = await getCoursePageById(parseInt(assign.courseId));
    if (course && (req.role === 'instructor' && req.user == course.instructorId) || req.admin) {
      try {
        const deleteSuccessful = await deleteAssignmentById(req.params.id);
        console.log(deleteSuccessful);
        if (deleteSuccessful) {
          res.status(204).send({
              success: "success!",
              id: req.params.id
          });
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to delete assignment. Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
  } else {
    res.status(404).send({
      error: "assignment " + req.params.id + " not found"
    });
  }
});



module.exports = router;
