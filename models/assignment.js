/*
 * Assignment schema and data accessor methods.
 */

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing required/optional fields of a assignemnt object.
 */
const AssignmentSchema = {
  description: { require: true },
  courseId: { required: true },
  title: { require: true },
  points: { require: true },
  due: { require: true }
};
exports.AssignmentSchema = AssignmentSchema;

/*
 * Executes a MySQL query to insert a new assignemnt into the database.  Returns
 * a Promise that resolves to the ID of the newly-created assignemnt entry.
 */
function insertNewAssignment(assignemnt) {
  return new Promise((resolve, reject) => {
    assignemnt = extractValidFields(assignemnt, AssignmentSchema);
    mysqlPool.query(
      'INSERT INTO assignemnts SET ?',
      assignemnt,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
}
exports.insertNewAssignment = insertNewAssignment;

/*
 * Executes a MySQL query to fetch a single specified assignemnt based on its ID.
 * Returns a Promise that resolves to an object containing the requested
 * assignemnt.  If no assignemnt with the specified ID exists, the returned Promise
 * will resolve to null.
 */
function getAssignmentById(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM assignemnts WHERE id = ?',
      [ id ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}
exports.getAssignmentById = getAssignmentById;

/*
 * Executes a MySQL query to replace a specified assignemnt with new data.
 * Returns a Promise that resolves to true if the assignemnt specified by
 * `id` existed and was successfully updated or to false otherwise.
 */
function replaceAssignmentById(id, assignemnt) {
  return new Promise((resolve, reject) => {
    assignemnt = extractValidFields(assignemnt, AssignmentSchema);
    mysqlPool.query(
      'UPDATE assignemnts SET ? WHERE id = ?',
      [ assignemnt, id ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
}
exports.replaceAssignmentById = replaceAssignmentById;

/*
 * Executes a MySQL query to delete a assignemnt specified by its ID.  Returns
 * a Promise that resolves to true if the assignemnt specified by `id`
 * existed and was successfully deleted or to false otherwise.
 */
function deleteAssignmentById(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'DELETE FROM assignemnts WHERE id = ?',
      [ id ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
}
exports.deleteAssignmentById = deleteAssignmentById;

/*
 * Executes a MySQL query to fetch all assignemnts for a specified business, based
 * on the business's ID.  Returns a Promise that resolves to an array
 * containing the requested assignemnts.  This array could be empty if the
 * specified business does not have any assignemnts.  This function does not verify
 * that the specified business ID corresponds to a valid business.
 */
function getAssignmentsByBusinessId(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM assignemnts WHERE businessid = ?',
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
 * Executes a MySQL query to fetch all assignemnts by a specified user, based on
 * on the user's ID.  Returns a Promise that resolves to an array containing
 * the requested assignemnts.  This array could be empty if the specified user
 * does not have any assignemnts.  This function does not verify that the specified
 * user ID corresponds to a valid user.
 */
function getAssignmentsByUserId(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM assignemnts WHERE userid = ?',
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
