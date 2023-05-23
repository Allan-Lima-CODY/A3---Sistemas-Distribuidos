import express from "express";
import connection from "../connection.js";
import methods from "../generalMethods.js";
import exportedLogin from "./login.js";

const addressRoutes = express.Router();

addressRoutes.get("/addresslist", (req, res, error) => {
    if (methods.VerifyLoggedAndAdmin(res)) {
        const sql = "SELECT UserAddressID, " +
            "UserID, " +
            "CEP, " +
            "State, " +
            "City, " +
            "Province, " +
            "PublicPlace, " +
            "Number, " +
            "Complementary " +
            "FROM useraddress";

        connection.query(sql, (error, results) => {
            if (results.length > 0) {
                if (!error) {
                    res.status(200).json({ msg: "Data returned with success!", address: results });
                } else {
                    res.status(404).json({ msg: error });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

addressRoutes.get("/address", (req, res, error) => {
    if (methods.VerifyLoggedAndAdmin(res)) {
        let sql = "SELECT UserAddressID, " +
            "UserID, " +
            "CEP, " +
            "State, " +
            "City, " +
            "Province, " +
            "PublicPlace, " +
            "Number, " +
            "Complementary " +
            "FROM useraddress " +
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
                    res.status(200).json({ msg: "Data returned successfully!", address: results });
                } else {
                    res.status(500).json({ msg: "Error returning data from the database." });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

addressRoutes.post("/address", (req, res, error) => {
    if (methods.VerifyLogged(res)) {
        if (methods.VerifyHadAddress(res)) {
            const sql = 'INSERT INTO useraddress(UserID, CEP, State, City, Province, PublicPlace, Number, Complementary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const { UserID, CEP, State, City, Province, PublicPlace, Number, Complementary } = req.body;

            connection.query(sql, [UserID, CEP, State, City, Province, PublicPlace, Number, Complementary], (error, results) => {
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
        }
    } else {
        res.json({ msg: "You can't create a user when logged!" });
    }
});

export default addressRoutes;