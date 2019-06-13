/*
 * Assignment schema and data accessor methods.
 */

const mysqlPool = require('../lib/mysqlPool');
const { getDBReference } = require('../lib/mongo');
const { ObjectId, GridFSBucket } = require('mongodb');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing required/optional fields of a assignment object.
 */
const AssignmentSchema = {
  description: { require: true },
  courseId: { required: true },
  title: { require: true },
  points: { require: true },
  due: { require: true }
};

exports.AssignmentSchema = AssignmentSchema;

const AssignmentPatchSchema = {
  description: { require: false },
  courseId: { required: false },
  title: { require: false },
  points: { require: false },
  due: { require: false }
};

exports.AssignmentPatchSchema = AssignmentPatchSchema;

/*
 * Executes a MySQL query to insert a new assignment into the database.  Returns
 * a Promise that resolves to the ID of the newly-created assignment entry.
 */
async function insertNewAssignment(assignment) {
  assignment = extractValidFields(assignment, AssignmentSchema);
  var date = new Date(assignment.due);
  assignment.due = date;
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}

exports.insertNewAssignment = insertNewAssignment;

/*
 * Executes a MySQL query to fetch a single specified assignment based on its ID.
 * Returns a Promise that resolves to an object containing the requested
 * assignment.  If no assignment with the specified ID exists, the returned Promise
 * will resolve to null.
 */
async function getAssignmentById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection("assignments");
    const results = await collection.find({ _id: new ObjectId(id) }).project({ _id: 0 }).toArray();
    // console.log(results);
    return results[0];
  }
}

exports.getAssignmentById = getAssignmentById;

/*
 * Executes a MySQL query to replace a specified assignment with new data.
 * Returns a Promise that resolves to true if the assignment specified by
 * `id` existed and was successfully updated or to false otherwise.
 */
async function updateAssignmentById(id, assignment) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set : assignment }
    );
    return result.matchedCount > 0;
  }
}
exports.updateAssignmentById = updateAssignmentById;

/*
 * Executes a MySQL query to delete a assignment specified by its ID.  Returns
 * a Promise that resolves to true if the assignment specified by `id`
 * existed and was successfully deleted or to false otherwise.
 */
async function deleteAssignmentById(id) {
  console.log(id);
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.deleteOne(
      { _id: new ObjectId(id) }
    );
    return id;
  }
}
exports.deleteAssignmentById = deleteAssignmentById;

/*
 * Executes a MySQL query to fetch all assignments for a specified business, based
 * on the business's ID.  Returns a Promise that resolves to an array
 * containing the requested assignments.  This array could be empty if the
 * specified business does not have any assignments.  This function does not verify
 * that the specified business ID corresponds to a valid business.
 */
function getAssignmentsByBusinessId(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM assignments WHERE businessid = ?',
      [ id ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}
exports.getAssignmentsByBusinessId = getAssignmentsByBusinessId;

/*
 * Executes a MySQL query to fetch all assignments by a specified user, based on
 * on the user's ID.  Returns a Promise that resolves to an array containing
 * the requested assignments.  This array could be empty if the specified user
 * does not have any assignments.  This function does not verify that the specified
 * user ID corresponds to a valid user.
 */
function getAssignmentsByUserId(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM assignments WHERE userid = ?',
      [ id ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}
exports.getAssignmentsByUserId = getAssignmentsByUserId;
