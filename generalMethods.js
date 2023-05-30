import exportedLogin from "./routes/login.js";
import connection from "./connection.js";

function VerifyLoggedAndAdmin(res) {
    console.log(exportedLogin.login);

    if (Object.keys(exportedLogin.login).length > 0) {
        if (exportedLogin.login.Admin === 1) {
            return true;
        } else {
            res.status(404).json({ msg: "You are not an admin to request this command!" });
            return false;
        }
    } else {
        console.log(exportedLogin.login);
        res.status(404).json({ msg: "You are not logged in!" });
        return false;
    }
}

function VerifyLogged() {
    if (Object.keys(exportedLogin.login).length > 0) {
        return true;
    } else {
        return false;
    }
}

async function VerifyIfHadAddress() {
    const sql = "SELECT UserID FROM useraddress WHERE UserID = " + exportedLogin.login.UserID;
  
    try {
      const results = await new Promise((resolve, reject) => {
        connection.query(sql, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  
      if (results.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

const methods = {
    VerifyLoggedAndAdmin,
    VerifyLogged,
    VerifyIfHadAddress
}

export default methods;