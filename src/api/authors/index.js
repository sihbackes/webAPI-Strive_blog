import express, { request } from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkPostSchema, triggerBadRequest } from "./validator.js";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";

const { NotFound } = httpErrors;
const authorsRouter = express.Router();

//POST//
authorsRouter.post(
  "/",
  checkPostSchema,
  triggerBadRequest,
  async (request, response, next) => {
    try {
      console.log("REQUEST BODY: ", request);
      const newAuthor = {
        ...request.body,
        id: uniqid(),
      };
      const authorsArray = await getAuthors();
      authorsArray.push(newAuthor);
      writeAuthors(authorsArray);
      response.status(201).send({ id: newAuthor.id });
    } catch (error) {
      next(error);
    }
  }
);

//GET//
authorsRouter.get("/", async (request, response, next) => {
  try {
    const authorsArray = await getAuthors();
    response.send(authorsArray);
  } catch (error) {
    next(error);
  }
});

//GET BY ID//
authorsRouter.get("/:authorId", async (request, response, next) => {
  try {
    const authorsArray = await getAuthors();
    const author = authorsArray.find(
      (author) => author.id === request.params.auhtorId
    );
    if (author) {
      response.send(author);
    } else {
      next(NotFound(`Author with id ${request.params.authorId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//EDIT//
authorsRouter.put("/:authorId", async (request, response, next) => {
  try {
    const authorsArray = await getAuthors();
    const index = authorsArray.findIndex(
      (author) => author.id === request.params.auhtorId
    );
    if (index !== 1) {
      const oldAuthor = authorsArray[index];
      const updatedAuthor = {
        ...oldAuthor,
        ...request.body,
        updatedAt: new Date(),
      };
      authorsArray[index] = updatedAuthor;
      writePost(authorsArray);
      response.send(updatedAuthor);
    } else {
      next(NotFound(`Author with id ${request.params.authorId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//DELETE//
authorsRouter.delete("/:authorId", async (request, response, next) => {
  try {
    const authorsArray = await getAuthors();
    const remainingAuthors = authorsArray.filter(
      (author) => author.id !== request.params.authorId
    );
    if (authorsArray.length !== remainingAuthors.length) {
      writePost(remainingAuthors);
      response.status(204).send();
    } else {
      next(NotFound(`Author with id ${request.params.authorId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
