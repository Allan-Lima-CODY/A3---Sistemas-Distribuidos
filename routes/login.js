import express from "express";
import connection from "../connection.js";

const loginRoutes = express.Router();

const exportedLogin = {
    login: {}, // objeto login vazio
    loginRoutes,
    clearLogin: function () {
        this.login = {}; // redefine o objeto login para um objeto vazio
    },
};

loginRoutes.post("/login", (req, res, error) => {
    if (Object.keys(exportedLogin.login).length === 0) {
        const sql = "SELECT UserID, " +
            "Name, " +
            "Email, " +
            "Password, " +
            "CellPhone, " +
            "CPF, " +
            "Admin " +
            "FROM users U " +
            "WHERE Email = ? AND Password = ?";

        const { Email, Password } = req.body;

        connection.query(sql, [Email, Password], (err, results) => {
            if (err) {
                res.status(500).json({ message: 'Unable to retrieve data from the database.' });
            } else if (results.length === 0) {
                res.status(404).json({ message: 'Email or password is incorrect.' });
            } else if (results.length > 0) {
                Object.assign(exportedLogin.login, results[0]);

                console.log(exportedLogin.login);
                res.status(200).json({ message: 'Login successful!' });
            }
        });
    } else {
        res.json({ message: 'You are already logged in.' });
    }
});

loginRoutes.get("/logout", (req, res, error) => {
    if (Object.keys(exportedLogin.login).length !== 0) {
        exportedLogin.clearLogin();
        res.status(200).json({ message: 'Logout successful!' });
    } else {
        res.json({ message: 'You are not logged in.' });
    }

    console.log(exportedLogin.login);
});

export default exportedLogin;