/*
 * User schema and data accessor methods.
 */

const { ObjectId } = require('mysql');
const bcrypt = require('bcryptjs');

const { extractValidFields } = require('../lib/validation');
const mysqlPool = require('../lib/mysqlPool');

/*
 * Schema for a User.
 */
const UserSchema = {
  name: { required: true },
  email: { required: true },
  password: { required: true },
  role: { require: true }
};
exports.UserSchema = UserSchema;

/*
 * Insert a new User into the DB.
 */
exports.insertNewUser = async function (user) {
  const userToInsert = extractValidFields(user, UserSchema);
  const passwordHash = await bcrypt.hash(userToInsert.password, 8);
  userToInsert.password = passwordHash;

  return new Promise((resolve, reject) => {
  mysqlPool.query(
    'INSERT INTO users SET ?',
    userToInsert,
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

/*
 * Fetch a user from the DB based on nothing.
 */

function escape(type, value){
  let construct = `SET @sql = CONCAT('SELECT ', (SELECT REPLACE(GROUP_CONCAT(COLUMN_NAME), 'password,', '')`
              +  `FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'tarpaulin'),`
              +  `' FROM users', ' WHERE ` + type + ` = ` + `"` + value + `"` + ` ');PREPARE stmt1 FROM @sql;EXECUTE stmt1`;
  return construct;
}

async function getUser(type, includePassword){
  return new Promise((resolve, reject) => {
    if(includePassword){
      mysqlPool.query(
      'SELECT * FROM users WHERE email = ?',
      [ type ],
      function (err,results) {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    }
    else {
      var queryData;
      if(isNaN(type)){
        queryData = escape('email',type);
      } else {
        queryData = escape('id',type);
      }
      mysqlPool.query( queryData,
      function (err,results) {
        if (err) {
          reject(err);
        } else {
          resolve(results[2]);
        }
      });
    }
  });
}

exports.getUser = getUser;

exports.validateUser = async function (email, password, includePassword) {
  var user;
  if(includePassword){
    user = await getUser(email,true);
  }
  else{
    user = await getUser(email,null);
  }
  const authenticated = user && await bcrypt.compare(password, user.password);
  return authenticated;
};
