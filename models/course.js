const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');
const Parse = require('json2csv').parse;

const CourseSchema = {
  description: { required: false },
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: true },
};
exports.CourseSchema = CourseSchema;

const CoursePatchSchema = {
  description: { required: false },
  subject: { required: false },
  number: { required: false },
  title: { required: false },
  term: { required: false },
  instructorId: { required: false },
};
exports.CoursePatchSchema = CoursePatchSchema;

const EnrollSchema = {
  course: { require: true },
  student: { required: true },
};
exports.EnrollSchema = EnrollSchema;

async function getCourseCount() {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT COUNT(*) AS count FROM courses',
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count);
        }
      }
    );
  });
}

exports.getcoursePage = async function (page, subject, term, number) {
  return new Promise(async (resolve, reject) => {
    try{
        const count = await getCourseCount();
        const pageSize = 10;
        const lastPage = Math.ceil(count / pageSize);
        page = page < 1 ? 1 : page;
        page = page > lastPage ? lastPage : page;
        const offset = (page - 1) * pageSize;

        let queryData = 'SELECT * FROM courses ORDER BY id LIMIT ?,?'
        mysqlPool.query(
          queryData,
          // 'SELECT * FROM courses ORDER BY id WHERE subject = ? AND number = ? AND term = ? LIMIT ?,?',
          // [ subject, number, term, offset, pageSize ],
          [offset, pageSize ],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                Courses: results,
                page: page,
                totalPages: lastPage,
                pageSize: pageSize,
                count: count
              });
            }
          }
        );
    }catch(err){
        reject(err);
    }

  });
};

exports.insertCoursePage = async function (course) {
  return new Promise(async (resolve, reject) => {
    const value = {
      id: null,
      description: course.description,
      subject: course.subject,
      number: course.number,
      title: course.title,
      term: course.term,
      instructorId: course.instructorId
    };
    mysqlPool.query('INSERT INTO courses SET ?',
        [value],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.insertId);
          }
        }
    );
  });
};

exports.getCoursePageById = async function (courseId){
  return new Promise(async (resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM courses WHERE id = ?',
      [ courseId ],
      function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
    );
  });
};

exports.getInstructorById = async function (courseId){
    return new Promise(async (resolve, reject) => {
            mysqlPool.query(
                'SELECT instructorId FROM courses WHERE id = ?',
                [ courseId ],
                function (err, results) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(results[0]);
                    }
                  }
            );
    });
};

exports.updateCoursePageById = async function (courseId, course) {
  return new Promise(async (resolve, reject) => {
    const value = {
      description: course.description,
      subject: course.subject,
      number: course.number,
      title: course.title,
      term: course.term
    };
    mysqlPool.query('UPDATE courses SET ? WHERE id = ?',
        [value, courseId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.affectedRows > 0);
          }
        }
    );
  });
};

exports.deleteCoursePageById = async function (courseId){
    return new Promise(async (resolve, reject) => {
      mysqlPool.query(
          'DELETE FROM courses WHERE id = ?',
          [ courseId ],
          function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows > 0);
          }
        }
      );
    });
};

exports.getEnrollById = async function (courseId){
  return new Promise(async (resolve, reject) => {
    mysqlPool.query(
      'SELECT student FROM enroll WHERE course = ? ',
      [ courseId ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

exports.insertEnrollPage = async function (courseId, studentId) {
  return new Promise(async (resolve, reject) => {
    const value = {
      course: courseId,
      student: studentId
    };
    mysqlPool.query('INSERT INTO enroll SET ?',
      [value],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
};

exports.removeEnroll = async function (courseId, studentId) {
  return new Promise(async (resolve, reject) => {
    mysqlPool.query('DELETE FROM enroll WHERE course = ? AND student = ?',
      [courseId,studentId],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.affectedRows > 0);
        }
      }
    );
  });
};

function getCoursePosterById(courseId){
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM enroll JOIN users ON enroll.student = users.id WHERE course = ?',
      [ courseId ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
		      const poster = Parse(results, {fields: [ "id", "name", "email"]})
          resolve(poster);
        }
      }
    );
  });
}
exports.getCoursePosterById = getCoursePosterById;

exports.deleteEnrollById = async function (enrollId) {
  return new Promise(async (resolve, reject) => {
    mysqlPool.query('DELETE FROM enroll WHERE course = ?',
        [enrollId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.affectedRows > 0);
          }
        }
    );
  });
};
