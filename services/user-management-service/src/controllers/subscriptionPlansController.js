const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const SubscriptionPlansModel = require("../models/SubscriptionPlansModel");
const PermissionModel = require("../models/PermissionsModel");
const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createSubscriptionPlan = async (req, res) => {
  const { subscription_plan, max_users, duration, price, currency, permissions, status } = req.body;

  try {
    const subscriptionPlan = await SubscriptionPlansModel.create({
      subscription_plan,
      max_users,
      duration,
      price,
      currency,
      permissions,
      status,
    });

    res
      .status(201)
      .json({ message: "Subscription plan created successfully", subscriptionPlan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating subscription plan", error: error.message });
  }
};

const updateSubscriptionPlan = async (req, res) => {
  const { id } = req.params;
  const { subscription_plan, max_users, duration, price, currency, permissions, status } = req.body;

  try {
    const subscriptionPlanToUpdate = await SubscriptionPlansModel.findByPk(id);

    if (!subscriptionPlanToUpdate) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    subscriptionPlanToUpdate.subscription_plan = subscription_plan || subscriptionPlanToUpdate.subscription_plan;
    subscriptionPlanToUpdate.max_users = max_users || subscriptionPlanToUpdate.max_users;
    subscriptionPlanToUpdate.duration = duration || subscriptionPlanToUpdate.duration;
    subscriptionPlanToUpdate.price = price || subscriptionPlanToUpdate.price;
    subscriptionPlanToUpdate.currency = currency || subscriptionPlanToUpdate.currency;
    subscriptionPlanToUpdate.permissions = permissions || subscriptionPlanToUpdate.permissions;
    subscriptionPlanToUpdate.status = status || subscriptionPlanToUpdate.status;

    await subscriptionPlanToUpdate.save();

    res.status(200).json({
      message: "Subscription plan updated successfully",
      subscriptionPlan: subscriptionPlanToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating subscription plan", error: error.message });
  }
};

const deleteSubscriptionPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const subscriptionPlanToDelete = await SubscriptionPlansModel.findByPk(id);

    if (!subscriptionPlanToDelete) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    await subscriptionPlanToDelete.destroy();
    res.status(200).json({ message: "Subscription plan deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting subscription plan", error: error.message });
  }
};

const getSubscriptionPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriptionPlan = await SubscriptionPlansModel.findByPk(id, {
      // include: [{ model: PermissionModel, as: 'permissions' }],
    });

    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    res.status(200).json(subscriptionPlan);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving subscription plan", error: error.message });
  }
};

const getAllSubscriptionPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSubscriptionPlans, rows: subscriptionPlans } =
      await SubscriptionPlansModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        // include: [{ model: PermissionModel, as: 'permissions' }],
      });

    res.status(200).json({
      totalSubscriptionPlans,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubscriptionPlans / limit),
      subscriptionPlans,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving subscription plans", error: error.message });
  }
};

const filterSubscriptionPlans = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalSubscriptionPlans, rows: subscriptionPlans } =
      await SubscriptionPlansModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        // include: [{ model: PermissionModel, as: 'permissions' }],
      });

    res.status(200).json({
      totalSubscriptionPlans,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubscriptionPlans / limit),
      subscriptionPlans,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering subscription plans", error: error.message });
  }
};

const exportFilteredSubscriptionPlansToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: subscriptionPlans } = await SubscriptionPlansModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      // include: [{ model: PermissionModel, as: 'permissions' }],
    });

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      return res.status(404).json({
        message: "No subscription plans found matching the filters",
      });
    }

    const subscriptionPlansData = subscriptionPlans.map((plan) => {
      return {
        uid: plan.uid,
        subscription_plan: plan.subscription_plan,
        max_users: plan.max_users,
        duration: plan.duration,
        price: plan.price,
        currency: plan.currency,
        permissions: plan.permissions,
        status: plan.status,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(subscriptionPlansData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_subscription_plans.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting subscription plans to CSV:", error);
    res.status(500).json({
      message: "Error exporting subscription plans to CSV",
      error: error.message,
    });
  }
};

const exportFilteredSubscriptionPlansToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: subscriptionPlans } = await SubscriptionPlansModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      // include: [{ model: PermissionModel, as: 'permissions' }],
    });

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      return res.status(404).json({
        message: "No subscription plans found matching the filters",
      });
    }

    const subscriptionPlansData = subscriptionPlans.map((plan) => {
      return [
        plan.uid || "N/A",
        plan.subscription_plan || "N/A",
        plan.max_users || "N/A",
        plan.duration || "N/A",
        plan.price || "N/A",
        plan.currency || "N/A",
        plan.permissions || "N/A",
        plan.status || "N/A",
        plan.created_at || "N/A",
        plan.updated_at || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Subscription Plans Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Plan ID",
                "Plan Name",
                "Max Users",
                "Duration",
                "Price",
                "Currency",
                "Permission",
                "Status",
                "Created At",
                "Updated At",
              ],
              ...subscriptionPlansData,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        body: {
          fontSize: 8,
          bold: true,
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
    };

    const printer = new PdfPrinter({
      Roboto: {
        normal: path.join(sourceDir, "Roboto-Regular.ttf"),
        bold: path.join(sourceDir, "Roboto-Medium.ttf"),
        italics: path.join(sourceDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.header("Content-Type", "application/pdf");
    res.attachment("subscription_plans_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting subscription plans to PDF:", error);
    res.status(500).json({
      message: "Error exporting subscription plans to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlanById,
  getAllSubscriptionPlans,
  filterSubscriptionPlans,
  exportFilteredSubscriptionPlansToCSV,
  exportFilteredSubscriptionPlansToPDF,
};