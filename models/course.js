const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

const CourseSchema = {
  description: { required: false },
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: true },

};
exports.BusinessSchema = CourseSchema;

const EnrollSchema = {
  student_id: { required: false },
  course_id: { required: true },
};
exports.BusinessSchema = EnrollSchema;

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

exports.getcoursePage = async function (page) {
  return new Promise(async (resolve, reject) => {
    try{
        const count = await getCourseCount();
        const pageSize = 10;
        const lastPage = Math.ceil(count / pageSize);
        page = page < 1 ? 1 : page;
        page = page > lastPage ? lastPage : page;
        const offset = (page - 1) * pageSize;

        mysqlPool.query(
          'SELECT * FROM courses ORDER BY id LIMIT ?,?',
          [ offset, pageSize ],
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

exports.updateCoursePageById = async function (courseId, course) {
  return new Promise(async (resolve, reject) => {
    const value = {
      description: course.description,
      subject: course.subject,
      number: course.number,
      title: course.title,
      term: course.term,
      instructorId: course.instructorId
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
                [ businessId ],
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
