const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");

const transactionController = {
  // Create a new transaction
  create: asyncHandler(async (req, res) => {
    let { type, category, amount, date, description } = req.body;

    // Validate required fields
    if (!type || !amount) {
      throw new Error(
        "Type and Amount are required for creating a transaction"
      );
    }

    // Set current date and time if date is not provided
    if (!date) {
      date = new Date();
    }

    // Create and save the new transaction
    const transaction = await Transaction.create({
      user: req.user,
      type,
      amount,
      date,
      category,
      description,
    });

    // Respond with the created transaction
    res.send(transaction);
  }),

  // Filter all transactions for the user
  getFilterTransaction: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    let filters = { user: req.user };

    if (startDate || endDate) {
      filters.date = {};
    }
    if (startDate) {
      filters.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filters.date.$lte = new Date(endDate);
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category === "All") {
        // No action needed, include all categories
      } else if (category == "Uncategorized") {
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }

    const transaction = await Transaction.find(filters).sort({ date: -1 });
    console.log(transaction);
    res.json({ transaction });
  }),
  // Update a transaction
  update: asyncHandler(async (req, res) => {
    //find by id
    const transaction = await Transaction.findById(req.params.id);

    if (transaction && transaction.user.toString() === req.user.toString()) {
      transaction.type = req.body.type || transaction.type;
      transaction.category = req.body.category || transaction.category;
      transaction.date = req.body.date || transaction.date;
      transaction.amount = req.body.amount || transaction.amount;
      transaction.description = req.body.description || transaction.description;

      const updateTransaction = await transaction.save();
      res.json(updateTransaction);
    }
  }),

  // Delete a transaction
  delete: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      await Transaction.findByIdAndDelete(req.params.id);
      res.json({ message: "Trasaction Remove" });
    }
  }),
};

module.exports = transactionController;
