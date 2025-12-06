import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import testRoutes from './routes/test.js';
import contractorsRoutes from './routes/contractors.js';
import projectsRoutes from './routes/projects.js';
import connectDbB from "./config/db.js";

const app = express();

connectDbB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/test', testRoutes);
app.use('/api/contractors', contractorsRoutes);
app.use('/api/projects', projectsRoutes);

app.get('/', (req, res) => {
    res.json({"msg": "Hello world"});
});

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});