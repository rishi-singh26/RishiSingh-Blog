import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import bodyParser from "body-parser";

import 'dotenv/config'

import indexRoutes from "./routes/index";
import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blog";

import Blog from "./models/blog";
import User from "./models/user";
import Token from "./models/token";

import sequelize from "./util/database";
import { fileFilter, fileStorage } from "./util/file";
import { CustomResponse } from "./util/custom_response";

import SocketIO from './socket';

const app = express();

app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/blog", blogRoutes);
app.use("/auth", authRoutes);
app.use("/", indexRoutes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomResponse) {
        console.log('From main CustomError handeller', error.message);
        res.status(error.statusCode ?? 500).json(error.toJson());
        return;
    }
    console.log('From main error handeller', error.message);
    res.status(error.statusCode ?? 500).json({ message: error.message })
})

User.hasMany(Blog, { foreignKey: 'userId' });
Blog.belongsTo(User, { foreignKey: 'userId' });

Token.belongsTo(User, { constraints: true, onDelete: 'CASCADE', foreignKey: 'userId' });
User.hasOne(Token, { foreignKey: 'userId' });

sequelize.sync()
    .then(() => {
        const server = app.listen(3000);
        const io = SocketIO.init(server);
        io.on('connection', socket => {
            console.log('client connected');
        })
    })
    .catch((err) => {
        console.log(err);
    });
