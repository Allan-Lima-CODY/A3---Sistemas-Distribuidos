import express from "express";
import exportedLogin from './routes/login.js';
import userRoutes from './routes/user.js';
import donationRoutes from './routes/donation.js';

const app = express();

app.use(express.json());
app.use(exportedLogin.loginRoutes);
app.use(userRoutes);
app.use(donationRoutes);

const port = 3000;
app.listen(port, () => {
    console.log("Server activate on port ", port);
});