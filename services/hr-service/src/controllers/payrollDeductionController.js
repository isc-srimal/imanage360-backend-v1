const PayrollDeduction = require("../../models/hr/PayrollDeductionModel");

// Create Deduction Entry
const createDeduction = async (req, res) => {
  const { type, amount, reason, action = "deduct_now" } = req.body;

  try {

    const deduction = await PayrollDeduction.create({
      type,
      amount,
      reason,
      action,
    });

    res.status(201).json({ message: "Deduction created", deduction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Deduction During Approval
const updateDeduction = async (req, res) => {
  const { id } = req.params;
  const { amount, action } = req.body;

  try {
    const deduction = await PayrollDeduction.findByPk(id);
    if (!deduction) return res.status(404).json({ error: "Deduction not found" });

    deduction.amount = amount ?? deduction.amount;
    deduction.action = action ?? deduction.action;

    await deduction.save();
    res.json({ message: "Deduction updated", deduction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Deductions for Approval Page
const getDeductionsByPayrollId = async (req, res) => {
  const { id } = req.params;

  try {
    const deductions = await PayrollDeduction.findAll({ where: { id } });
    res.json({ deductions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDeduction,
  updateDeduction,
  getDeductionsByPayrollId,
};
