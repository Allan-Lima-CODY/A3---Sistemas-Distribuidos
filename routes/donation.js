import express from "express";
import axios from "axios";
import connection from "../connection.js"

const donationRoutes = express.Router();

donationRoutes.get("/donationlist", (req, res, error) => {
    if (methods.VerifyLoggedAndAdmin(res)) {
        const sql = "SELECT DonationID, " +
            "UserDataID, " +
            "Object, " +
            "Amount, " +
            "Size, " +
            "Description, " +
            "FinallyConsiderations, " +
            "DonationsInstitution " +
            "FROM donations";

        connection.query(sql, (error, results) => {
            if (results.length > 0) {
                if (!error) {
                    res.status(200).json({ msg: "Data returned with success!", donation: results });
                } else {
                    res.status(404).json({ msg: error });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

donationRoutes.get("/donation", (req, res, error) => {
    if (methods.VerifyLoggedAndAdmin(res)) {
        let sql = "SELECT DonationID, " +
            "UserDataID, " +
            "Object, " +
            "Amount, " +
            "Size, " +
            "Description, " +
            "FinallyConsiderations, " +
            "DonationsInstitution " +
            "FROM donations " +
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
                    res.status(200).json({ msg: "Data returned successfully!", donation: results });
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
    } else {
        res.json({ msg: "You can't create a user when logged!" });
    }
});

export default donationRoutes;