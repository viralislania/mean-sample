
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
    console.log(req.body.password)
    console.log(req.body.email)
    bcrypt.hash(req.body.password, 5)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(result => {
                    res.status(200).json({
                        message: 'User created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });

}

exports.userLogin =  (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed1'
                });
            }
            fetchedUser= user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed2'
                });
            }
            //valid user
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
                'secretkey', { expiresIn: '12h' });

            res.status(200).json({
                message: 'Auth sucessful',
                token: token,
                expiresIn: '3600'
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Auth failed3'
            });
        })
}