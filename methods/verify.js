import exportedLogin from "../routes/login.js";

function VerifyLoggedAndAdmin(res) {
    if(exportedLogin.login.UserID > 0) {
        if(exportedLogin.login.Admin === 1) {
            return true;
        } else {
            res.status(404).json({ msg: "You ar not Admin for request this command!" });
            return false;
        }
    } else {
        console.log(exportedLogin.login);
        res.status(404).json({ msg: "You are not logged!" });
        return false;
    }
}

export default VerifyLoggedAndAdmin;