import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const authorSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and need to be a string!",
    },
  },
  surname: {
    in: ["body"],
    isString: {
      errorMessage: "Surname is a mandatory field and need to be a string!",
    },
  },
  email: {
    in: ["body"],
    isString: {
      errorMessage: "Email is a mandatory field and need to be a string!",
    },
  },
  dateOfBirth: {
    in: ["body"],
    isString: {
      errorMessage:
        "Date of Birth is a mandatory field and need to be a string!",
    },
  },
};

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
