import mysql from "mysql2";

const connection = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    database: "appdoacoes",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default connection;