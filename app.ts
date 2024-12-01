import express from "express";
import multer from "multer";
import path from "path";

import sequelize from "./util/database";
import { fileFilter, fileStorage } from "./util/file";
import blogRoutes from "./routes/blog";
import indexRoutes from "./routes/index";

const app = express();

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
);
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/blog", blogRoutes);

app.use("/", indexRoutes);

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
