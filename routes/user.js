import express from "express";
import connection from "../connection.js";
import methods from "../generalMethods.js";
import exportedLogin from "./login.js";

const userRoutes = express.Router();

userRoutes.get("/userslist", (req, res, error) => {
    if(methods.VerifyLoggedAndAdmin(res)){
        const sql = "SELECT UserID, " +
                           "Name, " +
                           "Email, " +
                           "CellPhone, " +
                           "CPF, " +
                           "Admin " + 
                           "FROM users";

        connection.query(sql, (error, results) => {
            if (results.length > 0) {
                if (!error) {
                    res.status(200).json({msg: "Data returned with success!", users: results});
                } else {
                    res.status(404).json({ msg: error });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

userRoutes.get("/users", (req, res, error) => {
    if(methods.VerifyLoggedAndAdmin(res)){
        let sql = "SELECT UserID, " +
                         "Name, " +
                         "Email, " +
                         "CellPhone, " +
                         "CPF, " +
                         "Admin " + 
                         "FROM users " + 
                         "WHERE ";
        const {Column, Value} = req.body;
        let params = [];

        if (typeof Value === 'string') {
            sql += `${Column} LIKE ?`;
            params.push(`%${Value}%`);
        } else {
            sql += `${Column} = ?`;
            params.push(Value);
        }

        connection.query(sql, params, (error, results) => {
            if (results.length > 0) {
                if (!error) {
                  res.status(200).json({ msg: "Data returned successfully!", users: results });
                } else {
                  res.status(500).json({ msg: "Error returning data from the database." });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

userRoutes.post("/users", (req, res, error) => {
    if(!methods.VerifyLogged(res)){
        const sql = 'INSERT INTO users(Name, Email, Password, CellPhone, CPF, Admin) VALUES (?, ?, ?, ?, ?, ?)';
        const {Name, Email, Password, CellPhone, CPF, Admin} = req.body;

        connection.query(sql, [Name, Email, Password, CellPhone, CPF, Admin], (error, results) => {
            if (results.affectedRows > 0) {
                if (!error) {
                    res.status(200).json({ msg: "Register successfully!" });
                } else {
                    res.status(500).json({ msg: "Error registering data from the database." });
                }
            } else {
                res.status(500).json({ msg: "A error ocurred!", error });
            }
        });
    } else {
        res.json({ msg: "You can't create a user when logged!" });
    }
});

userRoutes.put("/users", (req, res, error) => {
    if(methods.VerifyLogged(res)){
        let sql = "UPDATE users SET Name = ?, " +
                                   "Email = ?, " +
                                   "Password = ?, " +
                                   "CellPhone = ?, " +
                                   "CPF = ?, " +
                                   "Admin = ?"
                                   "WHERE UserID = " + exportedLogin.login.UserID;
        const {Name, Email, Password, CellPhone, CPF, Admin} = req.body;

    connection.query(sql, [Name, Email, Password, CellPhone, CPF, Admin], (error, results) => {
        if (results.affectedRows > 0) {
            if (!error) {
              res.status(200).json({ msg: "Data updated successfully!" });
            } else {
              res.status(500).json({ msg: "Error updating data from the database." });
            }
        } else {
            res.status(404).json({ msg: "Data not found!" });
        }
    });
    }
});

userRoutes.delete("/users", (req, res, error) => {
    if(methods.VerifyLoggedAndAdmin(res)){
        let sql = 'DELETE FROM users WHERE ';
        const {Column, Value} = req.body;
        let params = [];

        if (typeof Value === 'string') {
            sql += `${Column} LIKE ?`;
            params.push(`%${Value}%`);
        } else {
            sql += `${Column} = ?`;
            params.push(Value);
        }

        connection.query(sql, params, (error, results) => {
            if (results.affectedRows > 0) {
                if (!error) {
                  res.status(200).json({ msg: "Data deleted successfully!" });
                } else {
                  res.status(500).json({ msg: "Error deleting data from the database." });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

export default userRoutes;