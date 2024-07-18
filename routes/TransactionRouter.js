const express = require("express");
const isAuth = require("../middlewares/isAuth");
const transactionController = require("../controllers/transactionCtrl");
const transactionRouter = express.Router();

transactionRouter.post(
  "/api/v1/transaction/create",
  isAuth,
  transactionController.create
);
transactionRouter.get(
  "/api/v1/transaction/lists",
  isAuth,
  transactionController.getFilterTransaction
);
transactionRouter.put(
  "/api/v1/transaction/update/:id",
  isAuth,
  transactionController.update
);
transactionRouter.delete(
  "/api/v1/transaction/delete/:id",
  isAuth,
  transactionController.delete
);
module.exports = transactionRouter;
