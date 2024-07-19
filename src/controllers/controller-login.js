const config = require('../configs/database');
const jwt = require('jsonwebtoken');
let mysql = require('mysql');
let pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    login(req, res) {
        res.render("login", {
            url: 'http://localhost:5050/',
            colorFlash: req.flash('color'),
            statusFlash: req.flash('status'),
            pesanFlash: req.flash('message'),
        });
    },

    loginAuth(req, res) {
        let nip = req.body.username;
        let pwd = req.body.password;

        if (nip && pwd) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        status: 'error',
                        message: 'Internal server error'
                    });
                }

                let md5pwd = require('crypto')
                    .createHash('md5')
                    .update(pwd)
                    .digest('hex');

                connection.query(
                    `SELECT * FROM user u WHERE u.davice = 1 AND u.pwd = ? AND u.nip = ?`,
                    [md5pwd, nip],
                    function (error, results) {
                        if (error) {
                            connection.release();
                            console.error(error);
                            return res.status(500).json({
                                status: 'error',
                                message: 'Internal server error'
                            });
                        }

                        if (results.length > 0) {
                            const tokenPayload = {
                                nip: results[0].nip,
                            };

                            const accessToken = jwt.sign(tokenPayload, 'SECRET', { expiresIn: "1h" });

                            req.session.loggedin = true;
                            req.session.nip = tokenPayload.nip;

                            res.cookie('token', accessToken, { httpOnly: true });
                            res.redirect('/menu');
                        } else {
                            req.flash('color', 'danger');
                            req.flash('status', 'Oops..');
                            req.flash('message', 'Akun tidak ditemukan');
                            res.redirect('/login');
                        }

                        connection.release();
                    }
                );
            });
        } else {
            req.flash('color', 'danger');
            req.flash('status', 'Oops..');
            req.flash('message', 'Username dan password harus diisi');
            res.redirect('/login');
        }
    },

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
            }
            res.clearCookie('token');
            res.redirect('/login');
        });
    },

    refreshToken(req, res) {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({
                status: 'error',
                message: 'No token provided'
            });
        }

        jwt.verify(token, 'SECRET', (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Failed to authenticate token'
                });
            }

            const newTokenPayload = {
                nip: decoded.nip,
            };

            const newAccessToken = jwt.sign(newTokenPayload, 'SECRET', { expiresIn: "1h" });

            res.cookie('token', newAccessToken, { httpOnly: true });

            res.json({
                status: 'success',
                message: 'Token refreshed successfully',
                data: {
                    accessToken: newAccessToken,
                },
            });
        });
    },
};
