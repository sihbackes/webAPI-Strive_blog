import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const postsJSONPath = join(dataFolderPath, "posts.json");
const authorsJSONPath = join(dataFolderPath, "authors.json");

export const getPosts = () => readJSON(postsJSONPath);
export const writePost = (postsArray) => writeJSON(postsJSONPath.postsArray);
export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONPath.authorsArray);
