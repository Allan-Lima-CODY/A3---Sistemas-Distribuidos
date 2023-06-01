import express from "express";
import axios from "axios";
import connection from "../connection.js"
import exportedLogin from "./login.js";
import methods from "../generalMethods.js";

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
                    res.status(500).json({ msg: "Error returning data from the database.", Error: error });
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
                    res.status(500).json({ msg: "Error returning data from the database.", Error: error });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

donationRoutes.get("/listdonation", async (req, res, error) => {
    if (methods.VerifyLogged()) {
        try {
            const response = await axios.get(`http://localhost:4000/listlocaldonation`);

            res.json({ msg: "Here you can see the donations locals available", donationLocals: response.data });
        } catch (error) {
            res.status(400).json({ error: 'Unable to retrieve data' });
        }
    } else {
        res.json({ msg: "You can't see the local donations when not logged!" });
    }
});

donationRoutes.post("/donation/:id", async (req, res, error) => {
    if (methods.VerifyLogged()) {
        const hasAddress = await methods.VerifyIfHadAddress();

        if (hasAddress) {
            try {
                const id = req.params.id;

                const sql = 'INSERT INTO donations(UserDataID, Object, Amount, Size, Description, FinallyConsiderations, DonationsInstitution) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const { Object, Amount, Size, Description, FinallyConsiderations } = req.body;

                const DonationsInstitution = await axios.get(`http://localhost:4000/getlocaldonation/${id}`);
                console.log(DonationsInstitution.data);

                connection.query(sql, [exportedLogin.login.UserID, Object, Amount, Size, Description, FinallyConsiderations, JSON.stringify(DonationsInstitution.data)], (error, results) => {
                    if (results.affectedRows > 0) {
                        if (!error) {
                            res.status(200).json({ msg: "Register successfully!" });
                        } else {
                            res.status(500).json({ msg: "Error registering data from the database.", Error: error });
                        }
                    } else {
                        res.status(500).json({ msg: "A error ocurred!", Error: error });
                    }
                });
            } catch (error) {
                res.status(400).json({ error: 'Unable to retrieve data' });
            }
        } else {
            res.status(400).json({ msg: "You had an address registered!" });
        }
    } else {
        res.status(400).json({ msg: "You can't create a user when logged!" });
    }
});

donationRoutes.put("/donation/:id", async (req, res, error) => {
    if (methods.VerifyLogged()) {
        let sql = "UPDATE donations SET Object = ?, " +
            "Amount = ?, " +
            "Size = ?, " +
            "Description = ?, " +
            "FinallyConsiderations = ?, " +
            "DonationsInstitution = ? "
        "WHERE DonationID = ?";

        const { Object, Amount, Size, Description, FinallyConsiderations, DonationID } = req.body;
        const id = req.params.id;
        const DonationsInstitution = await axios.get(`http://localhost:4000/getlocaldonation/${id}`);
        console.log(DonationsInstitution.data);

        connection.query(sql, [Object, Amount, Size, Description, FinallyConsiderations, JSON.stringify(DonationsInstitution.data), DonationID], (error, results) => {
            if (results.affectedRows > 0) {
                if (!error) {
                    res.status(200).json({ msg: "Data updated successfully!" });
                } else {
                    res.status(500).json({ msg: "Error returning data from the database.", Error: error });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

donationRoutes.delete("/donation", (req, res, error) => {
    if (methods.VerifyLoggedAndAdmin(res)) {
        let sql = 'DELETE FROM donation WHERE ';
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
                    res.status(500).json({ msg: "Error returning data from the database.", Error: error });
                }
            } else {
                res.status(404).json({ msg: "Data not found!" });
            }
        });
    }
});

export default donationRoutes;