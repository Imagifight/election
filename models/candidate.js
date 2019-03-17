const mongoose = require('mongoose');

const CandidateSchema = mongoose.Schema({
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
    },
    votes: {
        type: Number,
        required: true
    },
    meta: Object,
    metaList: [String]
});

const Candidate = module.exports = mongoose.model('Candidate', CandidateSchema, 'candidates');

module.exports.getAll = (callback) => {
    Candidate.find(callback);
}
module.exports.get = (q, callback) => {
    Candidate.findOne(q, callback);
}
module.exports.edit = (conditions, update, callback) => {
    Candidate.findOneAndUpdate(conditions, update, {
        new: true
    }, callback);
}
module.exports.delete = (id, callback) => {
    let query = {
        _id: id
    };
    Candidate.deleteOne(query, callback);
}