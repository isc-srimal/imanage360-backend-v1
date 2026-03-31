// cronJobs/payrollScheduler.js
const cron = require("node-cron");
const moment = require("moment");
const Employee = require("../models/employees/EmployeeModel");
const { calculatePayroll } = require("../controllers/payrollController");

let isPayrollCronScheduled = false;

const schedulePayrollCalculation = () => {
  if (isPayrollCronScheduled) return;

  cron.schedule(
    "59 23 28-31 * *",
    async () => {
      const today = moment();
      if (today.date() === today.endOf("month").date()) {
        try {
          const employees = await Employee.findAll();
          for (const employee of employees) {
            await calculatePayroll(employee.id);
          }
          console.log("✅ Monthly payroll processed for all employees.");
        } catch (err) {
          console.error("❌ Error processing payroll:", err);
        }
      }
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );

  isPayrollCronScheduled = true;
  console.log("📅 Payroll cron job initialized.");
};

module.exports = { schedulePayrollCalculation };
