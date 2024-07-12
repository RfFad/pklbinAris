const config = require('../configs/database');

let mysql = require('mysql');
let pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    // Render tampilan untuk login yang ada di dalam folder 'src/views/login.ejs'
    login(req, res) {
        res.render("login", {
            url: 'http://localhost:5050/',
            // Kirim juga library flash yang telah di set
            colorFlash: req.flash('color'),
            statusFlash: req.flash('status'),
            pesanFlash: req.flash('message'),
        });
    },
    // Post / kirim data yang diinput user
    loginAuth(req, res) {
        let nip = req.body.username;
        let pwd = req.body.password;

        if (nip && pwd) {
            pool.getConnection(function (err, connection) {
                if (err) throw err;

                // Hash word dengan MD5
                let md5pwd = require('crypto')
                    .createHash('md5')
                    .update(pwd)
                    .digest('hex');

                connection.query(
                    `SELECT * FROM user u WHERE u.davice = 1 AND u.pwd = ? AND u.nip = ?`,
                    [md5pwd, nip],
                    function (error, results) {
                        if (error) throw error;
                        if (results.length > 0) {
                            // Jika data ditemukan, set sesi user tersebut menjadi true
                            req.session.loggedin = true;
                            req.session.nip = results[0].nip;
                            req.session.pwd = results[0].pwd;
                            res.redirect('/menu');
                        } else {
                            // Jika data tidak ditemukan, set library flash dengan pesan error yang diinginkan
                            req.flash('color', 'danger');
                            req.flash('status', 'Oops..');
                            req.flash('message', 'Akun tidak ditemukan');
                            res.redirect('/login');
                        }
                    }
                );
                connection.release();
            });
        } else {
            res.redirect('/login');
            res.end();
        }
    },
    // Fungsi untuk logout | Cara memanggilnya menggunakan url/rute 'http://localhost:5050/login/logout'
    logout(req, res) {
        // Hapus sesi user dari browser
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            // Hapus cookie yang masih tertinggal
            res.clearCookie('secretname');
            res.redirect('/login');
        });
    },
};
