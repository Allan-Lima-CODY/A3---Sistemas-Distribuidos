import express from "express";
import bcrypt from "bcryptjs";
import connection from "../connection.js";
import User from "../class/user.js"

const loginRoutes = express.Router();
let login = {};

loginRoutes.get("/login", (req, res, error) => {
    const sql = "SELECT UserID, " +
                       "Nome, " +
                       "Email, " +
                       "Senha, " +
                       "Celular, " +
                       "CPF, " +
                       "Admin " +
                   "FROM users U " +
                   "WHERE Email = ? " +
                   "AND Senha = ?";
    const { Email, Senha } = req.body;
    //const password = bcrypt.hashSync(req.body.password);

    connection.query(sql, [Email, Senha], (err, results) => {
        if(err){
            res.status(500).json({ message: 'Unable to retrieve data from database.' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'E-mail or password Email or password are not correct.' });
        } else if (results.length > 0) {
            Object.assign(login, results[0]);

            res.status(200).json({ message: 'Login successful!' });
        }
    });
});

const exportedLogin = {
    login,
    loginRoutes
}

export default exportedLogin;