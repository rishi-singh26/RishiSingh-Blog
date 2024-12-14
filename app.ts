import path from "path";
import fs from 'fs';

import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import bodyParser from "body-parser";
import morgan from 'morgan';

import 'dotenv/config'

import indexRoutes from "./routes/index";
import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blog";
import fileRoutes from "./routes/files";

import Blog from "./models/blog";
import User from "./models/user";
import Token from "./models/token";

import * as errorController from './controllers/error';
import { uploadFile } from "./controllers/file";

import sequelize from "./util/database";
import { fileFilter, fileStorage } from "./util/file";
import { CustomResponse } from "./util/custom_response";

import SocketIO from './socket';

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build'))); // make the build of admin react app publically available

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/upload-file', fileRoutes)
app.use('/blog', blogRoutes);
app.use('/auth', authRoutes);
app.get('/admin', (req: Request, res: Response, next: NextFunction) => {
    if (/(.ico|.js|.css|.jpg|.jpeg|.png|.map|.json|.txt|.pdf)$/i.test(req.path)) {
        next(); // Serve static files as usual
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'build', 'app.html')); // Serve React app
    }
});
app.get('/500', errorController.get500);
app.get('/404', errorController.get404);
app.use('/', indexRoutes);
app.use(errorController.get404); // any unknown route => show 404

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
        const server = app.listen(process.env.PORT);
        const io = SocketIO.init(server);
        io.on('connection', socket => {
            console.log('client connected');
        })
    })
    .catch((err) => {
        console.log(err);
    });
