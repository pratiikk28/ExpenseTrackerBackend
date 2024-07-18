const express = require("express");
const mongoose = require("mongoose");
const categoryRouter = require("./routes/categoryRouter");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandler");
const transactionRouter = require("./routes/TransactionRouter");
const app = express();

//! Connect To MongoDB
mongoose
  .connect("mongodb://localhost:27017/expense")
  .then(() => {
    console.log("Mogodb-Connected");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

//! Middleware
app.use(express.json());

//! Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);
//! Error Hanlder
app.use(errorHandler);

//! Start The Server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on : http://localhost:${port}`);
});
