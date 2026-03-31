const MaintenanceModel = require("../models/maintenance/MaintenanceModel");
const JobCardDetailsModel = require("../models/maintenance/JobCardDetailsModel");
const JobTimelineModel = require("../models/maintenance/JobTimelineModel");
const ServiceDetailsModel = require("../models/maintenance/ServiceDetailsModel");
const ServicePlanModel = require("../models/maintenance/ServicePlanModel");
const JobLocationModel = require("../models/JobLocationModel");
const MainCategoryModel = require("../models/MainCategoryModel");
const ServiceCategoryModel = require("../models/ServiceCategoryModel");
const ServiceProviderModel = require("../models/ServiceProviderModel");
const ServiceTypeOneModel = require("../models/ServiceTypeOneModel");
const ServiceTypeTwoModel = require("../models/ServiceTypeTwoModel");
const NextServiceTypeModel = require("../models/NextServiceTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const sequelize = require("../../src/config/dbSync");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createMaintenance = async (req, res) => {
  const {
    // Job Card Details fields
    plate_number,
    reported_date,
    reported_time,
    reported_by,
    customer_name,
    job_location_id,
    main_category_id,

    // Job Timeline fields
    maintenance_vehicle_plate_number,
    job_attented_date,
    job_attented_time,
    job_completed_date,
    job_completed_time,
    odometer,
    actual_service_intervels,
    actual_cost,
    approximate_cost,

    // Service Details fields
    service_category_id,
    service_provider_id,
    service_type_one_id,
    service_type_two_id,
    technician,
    service_diagnosis,
    reported_issue,
    root_cause_failure,

    // Service Plan fields
    next_service_date,
    engine_hours,
    next_service_type_id,
    notification,
    notes,
    supplier,
    supplier_invice_no,
  } = req.body;

  try {
    // Create Job Card Details
    const jobCard = await JobCardDetailsModel.create({
      plate_number,
      reported_date,
      reported_time,
      reported_by,
      customer_name,
      job_location_id,
      main_category_id,
    });

    // Create Job Timeline
    const jobTimeline = await JobTimelineModel.create({
      maintenance_vehicle_plate_number,
      job_attented_date,
      job_attented_time,
      job_completed_date,
      job_completed_time,
      odometer,
      actual_service_intervels,
      actual_cost,
      approximate_cost,
    });

    // Create Service Details
    const serviceDetails = await ServiceDetailsModel.create({
      service_category_id,
      service_provider_id,
      service_type_one_id,
      service_type_two_id,
      technician,
      service_diagnosis,
      reported_issue,
      root_cause_failure,
    });

    // Create Service Plan
    const servicePlan = await ServicePlanModel.create({
      next_service_date,
      engine_hours,
      next_service_type_id,
      notification,
      notes,
      supplier,
      supplier_invice_no,
    });

    // Create Maintenance record
    const maintenance = await MaintenanceModel.create({
      job_card_no: jobCard.job_card_no,
      service_details_id: serviceDetails.service_details_id,
      job_timeline_id: jobTimeline.job_timeline_id,
      service_plan_id: servicePlan.service_plan_id,
    });

    res.status(201).json({
      message: "Maintenance record created successfully",
      maintenance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaintenance = async (req, res) => {
  const { id } = req.params;
  const {
    // Job Card Details fields
    plate_number,
    reported_date,
    reported_time,
    reported_by,
    customer_name,
    job_location_id,
    main_category_id,

    // Job Timeline fields
    maintenance_vehicle_plate_number,
    job_attented_date,
    job_attented_time,
    job_completed_date,
    job_completed_time,
    odometer,
    actual_service_intervels,
    actual_cost,
    approximate_cost,

    // Service Details fields
    service_category_id,
    service_provider_id,
    service_type_one_id,
    service_type_two_id,
    technician,
    service_diagnosis,
    reported_issue,
    root_cause_failure,

    // Service Plan fields
    next_service_date,
    engine_hours,
    next_service_type_id,
    notification,
    notes,
    supplier,
    supplier_invice_no,
  } = req.body;

  try {
    const maintenance = await MaintenanceModel.findByPk(id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    // Update Job Card Details
    const jobCard = await JobCardDetailsModel.findByPk(maintenance.job_card_no);
    if (jobCard) {
      jobCard.plate_number = plate_number || jobCard.plate_number;
      jobCard.reported_date = reported_date || jobCard.reported_date;
      jobCard.reported_time = reported_time || jobCard.reported_time;
      jobCard.reported_by = reported_by || jobCard.reported_by;
      jobCard.customer_name = customer_name || jobCard.customer_name;
      jobCard.job_location_id = job_location_id || jobCard.job_location_id;
      jobCard.main_category_id = main_category_id || jobCard.main_category_id;
      await jobCard.save();
    }

    // Update Job Timeline
    const jobTimeline = await JobTimelineModel.findByPk(maintenance.job_timeline_id);
    if (jobTimeline) {
      jobTimeline.maintenance_vehicle_plate_number = maintenance_vehicle_plate_number || jobTimeline.maintenance_vehicle_plate_number;
      jobTimeline.job_attented_date = job_attented_date || jobTimeline.job_attented_date;
      jobTimeline.job_attented_time = job_attented_time || jobTimeline.job_attented_time;
      jobTimeline.job_completed_date = job_completed_date || jobTimeline.job_completed_date;
      jobTimeline.job_completed_time = job_completed_time || jobTimeline.job_completed_time;
      jobTimeline.odometer = odometer || jobTimeline.odometer;
      jobTimeline.actual_service_intervels = actual_service_intervels || jobTimeline.actual_service_intervels;
      jobTimeline.actual_cost = actual_cost || jobTimeline.actual_cost;
      jobTimeline.approximate_cost = approximate_cost || jobTimeline.approximate_cost;
      await jobTimeline.save();
    }

    // Update Service Details
    const serviceDetails = await ServiceDetailsModel.findByPk(maintenance.service_details_id);
    if (serviceDetails) {
      serviceDetails.service_category_id = service_category_id || serviceDetails.service_category_id;
      serviceDetails.service_provider_id = service_provider_id || serviceDetails.service_provider_id;
      serviceDetails.service_type_one_id = service_type_one_id || serviceDetails.service_type_one_id;
      serviceDetails.service_type_two_id = service_type_two_id || serviceDetails.service_type_two_id;
      serviceDetails.technician = technician || serviceDetails.technician;
      serviceDetails.service_diagnosis = service_diagnosis || serviceDetails.service_diagnosis;
      serviceDetails.reported_issue = reported_issue || serviceDetails.reported_issue;
      serviceDetails.root_cause_failure = root_cause_failure || serviceDetails.root_cause_failure;
      await serviceDetails.save();
    }

    // Update Service Plan
    const servicePlan = await ServicePlanModel.findByPk(maintenance.service_plan_id);
    if (servicePlan) {
      servicePlan.next_service_date = next_service_date || servicePlan.next_service_date;
      servicePlan.engine_hours = engine_hours || servicePlan.engine_hours;
      servicePlan.next_service_type_id = next_service_type_id || servicePlan.next_service_type_id;
      servicePlan.notification = notification || servicePlan.notification;
      servicePlan.notes = notes || servicePlan.notes;
      servicePlan.supplier = supplier || servicePlan.supplier;
      servicePlan.supplier_invice_no = supplier_invice_no || servicePlan.supplier_invice_no;
      await servicePlan.save();
    }

    await maintenance.save();

    res.status(200).json({
      message: "Maintenance record updated successfully",
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating maintenance record",
      error: error.message,
    });
  }
};

const deleteMaintenance = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const maintenance = await MaintenanceModel.findByPk(id, { transaction });

    if (!maintenance) {
      await transaction.rollback();
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    // Store foreign key values
    const jobCardNo = maintenance.job_card_no;
    const jobTimelineId = maintenance.job_timeline_id;
    const serviceDetailsId = maintenance.service_details_id;
    const servicePlanId = maintenance.service_plan_id;

    // Delete maintenance record first (child)
    await maintenance.destroy({ transaction });

    // Delete related records (parents)
    if (jobTimelineId) {
      await JobTimelineModel.destroy({ 
        where: { job_timeline_id: jobTimelineId },
        transaction 
      });
    }
    if (serviceDetailsId) {
      await ServiceDetailsModel.destroy({ 
        where: { service_details_id: serviceDetailsId },
        transaction 
      });
    }
    if (servicePlanId) {
      await ServicePlanModel.destroy({ 
        where: { service_plan_id: servicePlanId },
        transaction 
      });
    }
    if (jobCardNo) {
      await JobCardDetailsModel.destroy({ 
        where: { job_card_no: jobCardNo },
        transaction 
      });
    }

    // Commit transaction
    await transaction.commit();

    res.status(200).json({ message: "Maintenance record deleted successfully" });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    res.status(500).json({
      message: "Error deleting maintenance record",
      error: error.message,
    });
  }
};

const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await MaintenanceModel.findByPk(id, {
      include: [
        {
          model: JobCardDetailsModel,
          as: "jobCardDetails",
          include: [
            { model: JobLocationModel, as: "jobLocation" },
            { model: MainCategoryModel, as: "mainCategory" },
          ],
        },
        { model: JobTimelineModel, as: "jobTimeline" },
        {
          model: ServiceDetailsModel,
          as: "serviceDetails",
          include: [
            { model: ServiceCategoryModel, as: "serviceCategory" },
            { model: ServiceProviderModel, as: "serviceProvider" },
            { model: ServiceTypeOneModel, as: "serviceTypeOne" },
            { model: ServiceTypeTwoModel, as: "serviceTypeTwo" },
          ],
        },
        {
          model: ServicePlanModel,
          as: "servicePlan",
          include: [{ model: NextServiceTypeModel, as: "nextServiceType" }],
        },
      ],
    });

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving maintenance record",
      error: error.message,
    });
  }
};

const getAllMaintenance = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalMaintenance, rows: maintenance } =
      await MaintenanceModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: JobCardDetailsModel,
            as: "jobCardDetails",
            include: [
              { model: JobLocationModel, as: "jobLocation" },
              { model: MainCategoryModel, as: "mainCategory" },
            ],
          },
          { model: JobTimelineModel, as: "jobTimeline" },
          {
            model: ServiceDetailsModel,
            as: "serviceDetails",
            include: [
              { model: ServiceCategoryModel, as: "serviceCategory" },
              { model: ServiceProviderModel, as: "serviceProvider" },
              { model: ServiceTypeOneModel, as: "serviceTypeOne" },
              { model: ServiceTypeTwoModel, as: "serviceTypeTwo" },
            ],
          },
          {
            model: ServicePlanModel,
            as: "servicePlan",
            include: [{ model: NextServiceTypeModel, as: "nextServiceType" }],
          },
        ],
      });

    res.status(200).json({
      totalMaintenance,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMaintenance / limit),
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving maintenance records",
      error: error.message,
    });
  }
};

const filterMaintenance = async (req, res) => {
  try {
    const { 
      job_card_no, 
      plate_number, 
      page = 1, 
      limit = 10 
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    const jobCardWhere = {};

    if (job_card_no) {
      where.job_card_no = job_card_no;
    }

    if (plate_number) {
      jobCardWhere.plate_number = plate_number;
    }

    const { count: totalMaintenance, rows: maintenance } =
      await MaintenanceModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: JobCardDetailsModel,
            as: "jobCardDetails",
            where: Object.keys(jobCardWhere).length > 0 ? jobCardWhere : undefined,
            include: [
              { model: JobLocationModel, as: "jobLocation" },
              { model: MainCategoryModel, as: "mainCategory" },
            ],
          },
          { model: JobTimelineModel, as: "jobTimeline" },
          {
            model: ServiceDetailsModel,
            as: "serviceDetails",
            include: [
              { model: ServiceCategoryModel, as: "serviceCategory" },
              { model: ServiceProviderModel, as: "serviceProvider" },
              { model: ServiceTypeOneModel, as: "serviceTypeOne" },
              { model: ServiceTypeTwoModel, as: "serviceTypeTwo" },
            ],
          },
          {
            model: ServicePlanModel,
            as: "servicePlan",
            include: [{ model: NextServiceTypeModel, as: "nextServiceType" }],
          },
        ],
      });

    res.status(200).json({
      totalMaintenance,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMaintenance / limit),
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering maintenance records",
      error: error.message,
    });
  }
};

const exportFilteredMaintenanceToCSV = async (req, res) => {
  try {
    const { 
      job_card_no, 
      plate_number, 
      page = 1, 
      limit = 10 
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    const jobCardWhere = {};

    if (job_card_no) {
      where.job_card_no = job_card_no;
    }

    if (plate_number) {
      jobCardWhere.plate_number = plate_number;
    }

    const { rows: maintenance } = await MaintenanceModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: JobCardDetailsModel,
          as: "jobCardDetails",
          where: Object.keys(jobCardWhere).length > 0 ? jobCardWhere : undefined,
          include: [
            { model: JobLocationModel, as: "jobLocation" },
            { model: MainCategoryModel, as: "mainCategory" },
          ],
        },
        { model: JobTimelineModel, as: "jobTimeline" },
        {
          model: ServiceDetailsModel,
          as: "serviceDetails",
          include: [
            { model: ServiceCategoryModel, as: "serviceCategory" },
            { model: ServiceProviderModel, as: "serviceProvider" },
            { model: ServiceTypeOneModel, as: "serviceTypeOne" },
            { model: ServiceTypeTwoModel, as: "serviceTypeTwo" },
          ],
        },
        {
          model: ServicePlanModel,
          as: "servicePlan",
          include: [{ model: NextServiceTypeModel, as: "nextServiceType" }],
        },
      ],
    });

    if (!maintenance || maintenance.length === 0) {
      return res.status(404).json({
        message: "No maintenance records found matching the filters",
      });
    }

    const maintenanceData = maintenance.map((m) => {
      return {
        maintenance_id: m.maintenance_id,
        job_card_no: m.job_card_no,
        job_timeline_id: m.job_timeline_id,
        service_details_id: m.service_details_id,
        service_plan_id: m.service_plan_id,
        plate_number: m.jobCardDetails?.plate_number || "N/A",
        reported_date: m.jobCardDetails?.reported_date || "N/A",
        reported_time: m.jobCardDetails?.reported_time || "N/A",
        reported_by: m.jobCardDetails?.reported_by || "N/A",
        customer_name: m.jobCardDetails?.customer_name || "N/A",
        job_location: m.jobCardDetails?.jobLocation?.job_location_name || "N/A",
        main_category: m.jobCardDetails?.mainCategory?.main_category || "N/A",
        maintenance_vehicle_plate_number: m.jobTimeline?.maintenance_vehicle_plate_number || "N/A",
        job_attented_date: m.jobTimeline?.job_attented_date || "N/A",
        job_attented_time: m.jobTimeline?.job_attented_time || "N/A",
        job_completed_date: m.jobTimeline?.job_completed_date || "N/A",
        job_completed_time: m.jobTimeline?.job_completed_time || "N/A",
        odometer: m.jobTimeline?.odometer || "N/A",
        actual_service_intervels: m.jobTimeline?.actual_service_intervels || "N/A",
        approximate_cost: m.jobTimeline?.approximate_cost || "N/A",
        actual_cost: m.jobTimeline?.actual_cost || "N/A",
        technician: m.serviceDetails?.technician || "N/A",
        service_diagnosis: m.serviceDetails?.service_diagnosis || "N/A",
        reported_issue: m.serviceDetails?.reported_issue || "N/A",
        root_cause_failure: m.serviceDetails?.root_cause_failure || "N/A",
        service_category: m.serviceDetails?.serviceCategory?.service_category || "N/A",
        service_provider: m.serviceDetails?.serviceProvider?.service_provider || "N/A",
        service_type_one: m.serviceDetails?.serviceTypeOne?.service_type_one || "N/A",
        service_type_two: m.serviceDetails?.serviceTypeTwo?.service_type_two || "N/A",
        next_service_date: m.servicePlan?.next_service_date || "N/A",
        engine_hours: m.servicePlan?.engine_hours || "N/A",
        next_service_type: m.servicePlan?.nextServiceType?.next_service_type || "N/A",
        notification: m.servicePlan?.notification || "N/A",
        notes: m.servicePlan?.notes || "N/A",
        supplier: m.servicePlan?.supplier || "N/A",
        supplier_invice_no: m.servicePlan?.supplier_invice_no || "N/A",
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(maintenanceData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_maintenance.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting maintenance to CSV:", error);
    res.status(500).json({
      message: "Error exporting maintenance to CSV",
      error: error.message,
    });
  }
};

const exportFilteredMaintenanceToPDF = async (req, res) => {
  try {
    const { 
      job_card_no, 
      plate_number, 
      page = 1, 
      limit = 10 
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    const jobCardWhere = {};

    if (job_card_no) {
      where.job_card_no = job_card_no;
    }

    if (plate_number) {
      jobCardWhere.plate_number = plate_number;
    }

    const { rows: maintenance } = await MaintenanceModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: JobCardDetailsModel,
          as: "jobCardDetails",
          where: Object.keys(jobCardWhere).length > 0 ? jobCardWhere : undefined,
          include: [
            { model: JobLocationModel, as: "jobLocation" },
            { model: MainCategoryModel, as: "mainCategory" },
          ],
        },
        { model: JobTimelineModel, as: "jobTimeline" },
        {
          model: ServiceDetailsModel,
          as: "serviceDetails",
          include: [
            { model: ServiceCategoryModel, as: "serviceCategory" },
            { model: ServiceProviderModel, as: "serviceProvider" },
            { model: ServiceTypeOneModel, as: "serviceTypeOne" },
            { model: ServiceTypeTwoModel, as: "serviceTypeTwo" },
          ],
        },
        {
          model: ServicePlanModel,
          as: "servicePlan",
          include: [{ model: NextServiceTypeModel, as: "nextServiceType" }],
        },
      ],
    });

    if (!maintenance || maintenance.length === 0) {
      return res.status(404).json({
        message: "No maintenance records found matching the filters",
      });
    }

    const maintenanceData = maintenance.map((m) => {
      return [
        m.maintenance_id || "N/A",
        m.job_card_no || "N/A",
        m.jobCardDetails?.plate_number || "N/A",
        m.jobCardDetails?.reported_date || "N/A",
        m.jobCardDetails?.customer_name || "N/A",
        m.jobTimeline?.odometer || "N/A",
        m.jobTimeline?.actual_cost || "N/A",
        m.serviceDetails?.technician || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Maintenance Records Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto", "auto", "*", "auto", "auto", "*"],
            body: [
              [
                "ID",
                "Job Card",
                "Plate",
                "Date",
                "Customer",
                "Odometer",
                "Cost",
                "Technician",
              ],
              ...maintenanceData,
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
    res.attachment("maintenance_records_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting maintenance to PDF:", error);
    res.status(500).json({
      message: "Error exporting maintenance to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceById,
  getAllMaintenance,
  filterMaintenance,
  exportFilteredMaintenanceToCSV,
  exportFilteredMaintenanceToPDF,
};