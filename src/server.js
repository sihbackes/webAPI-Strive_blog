import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouters from "./api/authors/index.js";

const server = express();
const port = 3001;
server.use(express.json());
server.use("/authors", authorsRouters);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("server is running", port);
});
