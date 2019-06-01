//Require mongoose package
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 16;

//Define UserSchema with title, description and category
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    sec: {
        type: String,
        required: true
    },
   house: {
       type: String,
       required: true
   },
   position: {
    type: String,
    required: true
   }
});

const User = module.exports = mongoose.model('User', UserSchema, 'users');

module.exports.getAll = (callback) => {
    User.find(callback);
}
module.exports.get = (q, callback) => {
    User.findOne(q, callback);
}
module.exports.register = (newUser, callback) => {
    newUser.save(callback);
}
module.exports.edit = (conditions, update, callback) => {
    User.findOneAndUpdate(conditions, update, { new: true }, callback);
}
module.exports.delete = (id, callback) => {
    let query = { _id: id };
    User.deleteOne(query, callback);
}
// module.exports.auth = (username, password, callback) => {
//     err = false;
//     module.exports.get({ username: username }, (err, u) => {
//         var success, message;
//         (async function () {
//             if (err) {
//                 success = false;
//                 message = `Failed to load users. Error: ${err}`;
//             }
//             else if (!u) {
//                 success = false;
//                 message = `Failed to load users. Error: No user with username ${username}`;
//             }
//             else {
//                 await bcrypt.compare(password, u.pass).then((r, err) => {
//                     console.log("u.pass", u.pass, "password", password, r);
//                     if (err) {
//                         success = false;
//                         message = `Failed to authenticate user. Error: ${err}`;
//                     }
//                     else if (!r) {
//                         success = false;
//                         message = `Failed to authenticate user. Error: ${err}`;
//                     }
//                     else {
//                         success = true;
//                         message = "Authenticated successfully.";
//                     }
//                 });
//             }
//             await callback(success, message);
//             return success;
//         })();
//     });
// }