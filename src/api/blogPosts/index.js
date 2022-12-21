import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";
import httpErrors from "http-errors";

const { NotFound } = httpErrors;

const postsRouter = express.Router();

const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);

const getPosts = () => JSON.parse(fs.readFileSync(postsJSONPath));
const writePost = (postsArray) =>
  fs.writeFileSync(postsJSONPath, JSON.stringify(postsArray));

// POST //
postsRouter.post("/", (request, response, next) => {
  try {
    console.log("REQUEST BODY: ", request);
    const newPost = {
      ...request.body,
      _id: uniqid(),
      createAt: new Date(),
    };

    const postsArray = getPosts();
    postsArray.push(newPost);
    writePost(postsArray);
    response.status(201).send({ id: newPost._id });
  } catch (error) {
    next(error);
  }
});

// GET//
postsRouter.get("/", (request, response, next) => {
  try {
    const postsArray = getPosts();
    if (request.query && request.query.category) {
      const filteredPosts = postsArray.filter(
        (post) => post.category === request.query.category
      );
      response.send(filteredPosts);
    } else {
      response.send(postsArray);
    }
  } catch (error) {
    next(error);
  }
});

// GET BY ID //
postsRouter.get("/:postId", (request, response, next) => {
  try {
    const postsArray = getPosts();
    const post = postsArray.find((post) => post._id === request.params.postId);
    if (post) {
      response.send(post);
    } else {
      next(NotFound(`Post with id ${request.params.postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// EDIT //
postsRouter.put("/:postId", (request, response, next) => {
  try {
    const postsArray = getPosts();
    const index = postsArray.findIndex(
      (post) => post._id === request.params.postId
    );
    if (index !== 1) {
      const oldPost = postsArray[index];
      const updatedPost = {
        ...oldPost,
        ...request.body,
        updatedAt: new Date(),
      };
      postsArray[index] = updatedPost;
      writePost(postsArray);
      response.send(updatedPost);
    } else {
      next(NotFound(`Post with id ${request.params.postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//DELETE//
postsRouter.delete("/:postId", (request, response, next) => {
  try {
    const postsArray = getPosts();
    const remainingPosts = postsArray.filter(
      (post) => post._id !== request.params.postId
    );
    if (postsArray.length !== remainingPosts.length) {
      writePost(remainingPosts);
      response.status(204).send();
    } else {
      next(NotFound(`Post with id ${request.params.postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default postsRouter;
