//Require mongoose package
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
//const saltRounds = 16;

//Define VoterSchema with title, description and category
const VoterSchema = mongoose.Schema({
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
    voted: {
        type: Number,
        required: true
    }
});

const Voter = module.exports = mongoose.model('Voter', VoterSchema, 'voters');

module.exports.getAll = (callback) => {
    Voter.find(callback);
}
module.exports.get = (q, callback) => {
    Voter.findOne(q, callback);
}
// module.exports.register = (newVoter, callback) => {
//     newVoter.save(callback);
// }
module.exports.edit = (conditions, update, callback) => {
    Voter.findOneAndUpdate(conditions, update, {
        new: true
    }, callback);
}
module.exports.delete = (id, callback) => {
    let query = {
        _id: id
    };
    Voter.deleteOne(query, callback);
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