import express from "express";
import axios from "axios";
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

addressRoutes.post("/address", async (req, res, error) => {
    if (methods.VerifyLogged()) {
        if (methods.VerifyIfHadAddress(res)) {
            const { CEP, UserID, Number, Complementary } = req.body;

            try {
                const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`);
                const { localidade, uf, bairro, logradouro } = response.data;

                console.log(response.data);

                const sql = 'INSERT INTO useraddress(CEP, UserID, Number, Complementary, City, State, Province, PublicPlace) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                const values = [CEP, UserID, Number, Complementary, localidade, uf, bairro, logradouro];

                connection.query(sql, values, (error, results) => {
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
            } catch (error) {
                res.status(400).json({ error: 'CEP inválido' });
            }
        }
    } else {
        res.json({ msg: "You can't create a user when logged!" });
    }
});

addressRoutes.put("/address", async (req, res) => {
    if (methods.VerifyLogged()) {
        const { CEP, Number, Complementary } = req.body;

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`);
            const { localidade, uf, bairro, logradouro } = response.data;

            let sql = "UPDATE useraddress SET " +
                "CEP = ?, " +
                "State = ?, " +
                "City = ?, " +
                "Province = ?, " +
                "PublicPlace = ?, " +
                "Number = ?, " +
                "Complementary = ? " +
                "WHERE UserID = ?";

            const values = [CEP, uf, localidade, bairro, logradouro, Number, Complementary, exportedLogin.login.UserID];

            connection.query(sql, values, (error, results) => {
                console.log(sql);
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
        } catch (error) {
            res.status(400).json({ msg: "Invalid CEP!" });
        }
    }
});

addressRoutes.delete("/address", (req, res, error) => {
    if (methods.VerifyLoggedAndAdmin(res)) {
        let sql = 'DELETE FROM useraddress WHERE ';
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

export default addressRoutes;