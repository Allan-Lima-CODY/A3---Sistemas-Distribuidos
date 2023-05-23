import express from "express";
import bcrypt from "bcryptjs";
import connection from "../connection.js";

const loginRoutes = express.Router();
let login = {};

loginRoutes.get("/login", (req, res, error) => {
    if(Object.keys(login).length === 0) {
        const sql = "SELECT UserID, " +
                           "Name, " +
                           "Email, " +
                           "Password, " +
                           "CellPhone, " +
                           "CPF, " +
                           "Admin " +
                           "FROM users U " +
                           "WHERE Email = ?"
        const { Email, Password } = req.body;
        //const password = bcrypt.hashSync(req.body.password);

        connection.query(sql, [Email, Password], (err, results) => {
            if(err){
                res.status(500).json({ message: 'Unable to retrieve data from database.' });
            } else if (results.length === 0) {
                res.status(404).json({ message: 'E-mail or password Email or password are not correct.' });
            } else if (results.length > 0) {
                Object.assign(login, results[0]);

                res.status(200).json({ message: 'Login successful!' });
            }
        });
    } else {
        res.json({ message: 'You are logged.' });
    }
});

loginRoutes.get("/logout", (req, res, error) => {
    if (Object.keys(login).length !== 0) {
        Object.assign(login, {});

        res.status(200).json({ message: 'Logout successful!' });
    } else {
        res.json({ message: 'You are not logged.' });
    }
});

const exportedLogin = {
    login,
    loginRoutes
}

export default exportedLogin;