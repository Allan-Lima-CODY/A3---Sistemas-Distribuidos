import express from "express";
import connection from "../connection.js";
import VerifyLoggedAndAdmin from "../methods/verify.js";

const userRoutes = express.Router();

userRoutes.get("/userlist", (req, res, error) => {
    if(VerifyLoggedAndAdmin(res)){
        const sql = "SELECT * FROM users";

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

export default userRoutes;