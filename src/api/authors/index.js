import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouters = express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

authorsRouters.post("/", (request, response) => {
  console.log("REQUEST BODY: ", request.body);
  const newAuthor = {
    ...request.body,
    id: uniqid(),
    avatar: `https://ui-avatars.com/api/?name=${request.body.name}+${request.body.surname}`,
  };

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  response.status(201).send({ id: newAuthor.id });
});

authorsRouters.get("/", (request, response) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authors = JSON.parse(fileContent);
  response.send(authors);
});

authorsRouters.get("/:authorId", (request, response) => {
  const authorID = request.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const foundAuthor = authorsArray.find((author) => author.id === authorID);
  response.send(foundAuthor);
});

authorsRouters.put("/:authorId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorsArray.findIndex(
    (author) => author.id === request.params.authorId
  );
  const oldAuthor = authorsArray[index];

  const updatedAuthor = {
    ...oldAuthor,
    ...request.body,
    id: uniqid(),
    avatar: `https://ui-avatars.com/api/?name=${request.body.name}+${request.body.surname}`,
  };

  authorsArray[index] = updatedAuthor;
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  response.send(updatedAuthor);
});

authorsRouters.delete("/:authorId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== request.params.authorId
  );

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
  response.status(204).send();
});

export default authorsRouters;
