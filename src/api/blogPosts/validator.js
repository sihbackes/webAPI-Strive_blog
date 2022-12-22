import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const postSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and need to be a string!",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and need to be a string!",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "Cover is a mandatory field and need to be a string!",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage: "Unit is a mandatory field and need to be a string!",
    },
  },
  "readTime.value": {
    in: ["body"],
    isNumber: {
      errorMessage: "Value is a mandatory field and need to be a number!",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and need to be a string!",
    },
  },
  "author.avatar": {
    in: ["body"],
    isString: {
      errorMessage: "Avatar is a mandatory field and need to be a string!",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content is a mandatory field and need to be a string!",
    },
  },
};

export const checkPostSchema = checkSchema(postSchema);

export const triggerBadRequest = (request, response, next) => {
  const errors = validationResult(request);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
