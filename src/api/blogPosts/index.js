import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkPostSchema, triggerBadRequest } from "./validator.js";
import { getPosts, writePost } from "../../lib/fs-tools.js";

const { NotFound } = httpErrors;

const postsRouter = express.Router();

// POST //
postsRouter.post(
  "/",
  checkPostSchema,
  triggerBadRequest,
  async (request, response, next) => {
    try {
      console.log("REQUEST BODY: ", request);
      const newPost = {
        ...request.body,
        _id: uniqid(),
        createAt: new Date(),
      };

      const postsArray = await getPosts();
      postsArray.push(newPost);
      writePost(postsArray);
      response.status(201).send({ id: newPost._id });
    } catch (error) {
      next(error);
    }
  }
);

// GET//
postsRouter.get("/", async (request, response, next) => {
  try {
    const postsArray = await getPosts();
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
postsRouter.get("/:postId", async (request, response, next) => {
  try {
    const postsArray = await getPosts();
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
postsRouter.put("/:postId", async (request, response, next) => {
  try {
    const postsArray = await getPosts();
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
postsRouter.delete("/:postId", async (request, response, next) => {
  try {
    const postsArray = await getPosts();
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
