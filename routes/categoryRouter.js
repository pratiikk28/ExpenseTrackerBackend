const express = require("express");
const isAuth = require("../middlewares/isAuth");
const categoryController = require("../controllers/categoryCtrl");
const categoryRouter = express.Router();

categoryRouter.post(
  "/api/v1/categories/create",
  isAuth,
  categoryController.create
);
categoryRouter.get(
  "/api/v1/categories/lists",
  isAuth,
  categoryController.lists
);
categoryRouter.put(
  "/api/v1/categories/update/:categoryId",
  isAuth,
  categoryController.update
);
categoryRouter.delete(
  "/api/v1/categories/delete/:id",
  isAuth,
  categoryController.delete
);

module.exports = categoryRouter;
