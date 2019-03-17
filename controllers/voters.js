//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');
//const saltRounds = 16;
const cors = require('cors');
var server = require('../server').server;

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

const voter = require('../models/voter');
const candidate = require('../models/candidate');

let locked_state = true;
var lockid;

// io.on('connection', function (socket) {
//     console.log('socket.io: connected');
//     socket.on('disconnect', function(){
//         console.log('socket.io: disconnected');
//     });
// });

router.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

router.use(cors({
    origin: '*'
}));

router.get('/:un?', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let uname = req.params.un;
    console.log(`GET\t${uname}`);
    if (typeof uname === 'undefined') {
        voter.getAll((err, voters) => {
            if (err) {
                res.json({
                    success: false,
                    message: `Failed to load voters. Error: ${err}`
                });
            } else {
                res.json({
                    success: true,
                    voters: voters
                });
                //res.write(JSON.stringify({success: true, voters:voters},null,2));
                res.end();
            }
        });
    } else {
        voter.get({
            _id: uname
        }, (err, u) => {
            if (err) {
                res.json({
                    success: false,
                    message: `Failed to load voters. Error: ${err}`
                });
            } else if (!u) {
                res.json({
                    success: false,
                    message: `Failed to load voters. Error: No voter with votername ${uname}`
                });
            } else {
                res.json({
                    success: true,
                    voter: u
                });
                res.end();
            }
        });
    }
});
// router.post('/auth', (req, res) => {
//     username = req.body.username;
//     password = req.body.password;
//     var success, message;
//     voter.auth(username, password, async function (s, m) {
//         success = s;
//         message = m;
//         console.log('then', success, message);
//         await res.json({ success: success, message: message });
//     });
// });
// router.post('/new', (req, res) => {
//     console.log(req.body.pass);
//     if (req.body.pass) {
//         bcrypt.hash(req.body.pass, 16, function (err, hash) {
//             console.log(req.body.email);
//             if (err) { throw (err); }
//             if (/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(req.body.email)) {
//                 bcrypt.compare(req.body.pass, hash, function (err, result) {
//                     if (err) { throw (err); }
//                     let newVoter = new voter({
//                         name: req.body.name,
//                         email: req.body.email,
//                         pass: hash,
//                         grade: req.body.grade,
//                         sec: req.body.sec,
//                         status: req.body.status,
//                         username: req.body.username
//                     });
//                     console.log(`REG\t${newVoter}`);
//                     voter.register(newvoter, (err, u) => {
//                         if (err) {
//                             res.json({ success: false, message: `Failed to create a new user. Error: ${err}\n ${newUser}` });
//                         }
//                         else
//                             res.json({ success: true, message: "Added successfully." });

//                     });
//                 });
//             }
//             else {
//                 res.json({ success: false, message: `Invalid email address.` });
//             }
//         })
//     } else {
//         res.json({ success: false, message: `No password!` });
//     };
// });
router.get('/unlock/:v', (req, res) => {

    voter.get({
        _id: req.params.v
    }, (err, vot) => {
        var voted = vot.voted;
        if (locked_state && !voted) {
            lockid = req.params.v;
            //let c = req.params.c;
            let update = {
                voted: -1
            }; //unlocked
            (async function () {
                console.log(`UPDATE ${lockid}\t${JSON.stringify(update)}\t${voted}`);
                await voter.edit({
                    _id: lockid
                }, update, (err, updatedUser) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: `Failed to unlock. Error: ${err}\n ${update}`
                        });
                    } else if (!updatedUser) {
                        res.json({
                            success: false,
                            message: `Failed to unlock. Error: No user with id ${id}`
                        });
                    } else {
                        locked_state = false;
                        lockid = req.params.v;
                        global.io.emit('unlock', {
                            for: lockid
                        });

                        res.json({
                            success: true,
                            user: updatedUser
                        });
                        res.end();
                        // setTimeout(() => {
                        //     locked_state = true;
                        // }, 60000);
                    }
                })
            })().catch(err => {
                throw err;
            });
        } else
            res.json({
                success: false,
                message: `Failed to unlock. Error: already unlocked`
            });
    });
});

router.get('/vote/:c', (req, res) => {
    candidate.get({
        _id: req.params.c
    }, (err, cand) => {
        if (!locked_state) {
            let update = {
                voted: 1
            }; //voted
            (async function () {
                console.log(`VOTE ${lockid}\t${req.params.c}\t${cand}`);
                await voter.edit({
                    _id: lockid
                }, update, (err, updatedUser) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: `Failed to record vote. Error: ${err}\n ${update}`
                        });
                    } else if (!updatedUser) {
                        res.json({
                            success: false,
                            message: `Failed to record vote. Error: No user with id ${id}`
                        });
                    } else {
                        console.log(cand.votes);
                        (async function () {
                            await candidate.edit({
                                _id: req.params.c
                            }, {
                                votes: cand.votes + 1
                            }, (err, updatedCand) => {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: `Failed to record vote. Error: ${err}\n ${update}`
                                    });
                                } else if (!updatedUser) {
                                    res.json({
                                        success: false,
                                        message: `Failed to record vote. Error: No user with id ${id}`
                                    });
                                } else {
                                    locked_state = true;
                                    lockid = req.params.v;
                                    global.io.emit('lock', {
                                        for: lockid
                                    });

                                    res.json({
                                        success: true,
                                        user: updatedUser
                                    });
                                    res.end();
                                }
                            });
                        })();
                    }
                });

            })().catch(err => {
                throw err;
            });
        } else
            res.json({
                success: false,
                message: `Failed to vote. Error: locked`
            });
    });
});

router.delete('/:id', (req, res) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    console.log(`DELETE\t${id}`);
    //Call the model method delete
    user.delete(id, (err, u) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to delete the user. Error: ${err}`
            });
        } else if (u) {
            res.json({
                success: true,
                message: "Deleted successfully"
            });
        } else
            res.json({
                success: false
            });
    })
});
// var salt = bcrypt.genSaltSync(saltRounds);
// console.log(salt);
module.exports = router;