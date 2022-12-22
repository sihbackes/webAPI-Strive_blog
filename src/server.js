import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import postsRouter from "./api/blogPosts/index.js";
import cors from "cors";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./api/errorHandlers.js";

const server = express();
const port = 3001;
server.use(express.json());
server.use("/authors", authorsRouter);
server.use("/blogPosts", postsRouter);

server.use(cors());
///my handlers//
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("server is running", port);
});
