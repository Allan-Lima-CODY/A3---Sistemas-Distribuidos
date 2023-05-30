import express from "express";
import connection from "../connection.js";
import methods from "../generalMethods.js";
import exportedLogin from "./login.js";

const userRoutes = express.Router();

userRoutes.get("/userslist", (req, res, error) => {
    if (methods.VerifyLoggedAndAdmin(res)) {
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
                    res.status(200).json({ msg: "Data returned with success!", users: results });
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
    if (methods.VerifyLoggedAndAdmin(res)) {
        let sql = "SELECT UserID, " +
            "Name, " +
            "Email, " +
            "CellPhone, " +
            "CPF, " +
            "Admin " +
            "FROM users " +
            "WHERE ";
        const { Column, Value } = req.body;
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
    if (methods.VerifyLogged()) {
        const sql = 'INSERT INTO users(Name, Email, Password, CellPhone, CPF, Admin) VALUES (?, ?, ?, ?, ?, ?)';
        const { Name, Email, Password, CellPhone, CPF, Admin } = req.body;

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
    if (methods.VerifyLogged()) {
        let sql = "UPDATE users SET Name = ?, " +
            "Email = ?, " +
            "Password = ?, " +
            "CellPhone = ?, " +
            "CPF = ?, " +
            "Admin = ?"
        "WHERE UserID = " + exportedLogin.login.UserID;
        const { Name, Email, Password, CellPhone, CPF, Admin } = req.body;

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
    if (methods.VerifyLogged()) {
        let deleteUser = 'DELETE FROM users WHERE UserID = ' + exportedLogin.login.UserID;
        let deleteAdressUser = 'DELETE FROM useraddress WHERE UserID = ' + exportedLogin.login.UserID;
        let deleteDonationUser = 'DELETE FROM donations WHERE UserDataID = ' + exportedLogin.login.UserID;

        connection.query(deleteDonationUser, (error, donationResults) => {
            if (!error) {
                if (donationResults.affectedRows > 0) {
                    connection.query(deleteAdressUser, (error, addressResults) => {
                        if (!error) {
                            if (addressResults.affectedRows > 0) {
                                connection.query(deleteUser, (error, userResults) => {
                                    if (!error) {
                                        if (userResults.affectedRows > 0) {
                                            res.status(200).json({ msg: "Data deleted successfully!" });
                                        } else {
                                            res.status(404).json({ msg: "User data not found!" });
                                        }
                                    } else {
                                        res.status(500).json({ msg: "Error deleting user data from the database." });
                                    }
                                });
                            } else {
                                res.status(404).json({ msg: "Address data not found!" });
                            }
                        } else {
                            res.status(500).json({ msg: "Error deleting address data from the database." });
                        }
                    });
                } else {
                    res.status(404).json({ msg: "Donation data not found!" });
                }
            } else {
                res.status(500).json({ msg: "Error deleting donation data from the database." });
            }
        });
    } else {
        res.status(404).json({ msg: "You are note logged for execute this command." });
    }
});

export default userRoutes;