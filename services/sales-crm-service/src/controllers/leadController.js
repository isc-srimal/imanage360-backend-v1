const Lead = require("../models/LeadModel");
const SalesPipeline = require("../models/SalesPipelineModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const PipelineStage = require("../models/PipelineStageModel");
const { Op } = require("sequelize");
const fastCsv = require("fast-csv");
const fs = require("fs");
const path = require("path");

exports.createLead = async (req, res) => {
  try {
    let customFieldData = req.body.custom_field;
    
    if (customFieldData && typeof customFieldData === 'object') {
      customFieldData = JSON.stringify(customFieldData);
    }

    const leadData = {
      ...req.body,
      custom_field: customFieldData || '{}',
      name: req.body.name || 'Unknown',
      email: req.body.email || '',
      phone: req.body.phone || '',
      designation: req.body.designation || '',
      lead_subject: req.body.lead_subject || 'New Lead',
      additional_desc: req.body.additional_desc || '',
      sales_person: req.body.sales_person || '',
      label_id: req.body.label_id || '',
      sales_pipeline_id: req.body.sales_pipeline_id,
      pipeline_stages_id: req.body.pipeline_stages_id || 1, 
      prospect_id: req.body.prospect_id || 0,
      lead_source: req.body.lead_source || 'Website' 
    };

    const lead = await Lead.create(leadData);

    const createdLead = await Lead.findByPk(lead.id, {
      include: [
        {
          model: SalesPipeline,
          as: "salesPipeline",
          attributes: ["name", "description"],
        },
        {
          model: PipelineStage,
          as: "pipelineStage",
        },
        {
          model: EmployeeModel,
          as: "salesPersonEmployee",
        },
      ],
    });

    res.status(201).json(createdLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, pipeline_id, stage_id, search } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const offset = (pageNum - 1) * limitNum;

    const whereClause = {};
    if (pipeline_id) {
      whereClause.sales_pipeline_id = pipeline_id;
    }

    if (stage_id) {
      whereClause.pipeline_stages_id = stage_id;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { "$salesPipeline.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const { count: totalLeads, rows: leads } = await Lead.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: SalesPipeline,
          as: "salesPipeline",
          attributes: ["name", "description"],
        },
        {
          model: PipelineStage,
          as: "pipelineStage",
        },
        {
          model: EmployeeModel,
          as: "salesPersonEmployee",
        },
      ],
      offset,
      limit: limitNum,
    });

    res.status(200).json({
      totalLeads,
      currentPage: pageNum,
      totalPages: Math.ceil(totalLeads / limitNum),
      leads,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [
        {
          model: SalesPipeline,
          as: "salesPipeline",
          attributes: ["name", "description"],
        },
        {
          model: PipelineStage,
          as: "pipelineStage",
        },
        {
          model: EmployeeModel,
          as: "salesPersonEmployee",
        },
      ],
    });
    if (lead) {
      res.status(200).json(lead);
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [
        {
          model: SalesPipeline,
          as: "salesPipeline",
          attributes: ["name", "description"],
        },
        {
          model: PipelineStage,
          as: "pipelineStage",
        },
        {
          model: EmployeeModel,
          as: "salesPersonEmployee",
        },
      ],
    });
    if (lead) {
      await lead.update(req.body);
      res.status(200).json(lead);
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [
        {
          model: SalesPipeline,
          as: "salesPipeline",
          attributes: ["name", "description"],
        },
        {
          model: PipelineStage,
          as: "pipelineStage",
        },
        {
          model: EmployeeModel,
          as: "salesPersonEmployee",
        },
      ],
    });
    if (lead) {
      await lead.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.downloadLeadsCSV = async (req, res) => {
  try {
    const leads = await Lead.findAll({
      attributes: ["name", "phone", "email", "designation", "lead_subject"],
    });

    if (!leads.length) {
      return res.status(404).json({ message: "No leads found" });
    }

    res.status(200).json({ leads });
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getLeadsSummary = async (req, res) => {
  try {
    const { pipeline_id } = req.query;
    
    const whereClause = {};
    if (pipeline_id) {
      whereClause.sales_pipeline_id = pipeline_id;
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const allLeads = await Lead.findAll({
      where: whereClause,
      include: [
        {
          model: PipelineStage,
          as: "pipelineStage",
          attributes: ["stage_name", "closure_percentage"],
        },
      ],
    });

    const summary = {
      newLeads: 0,
      scheduledLeads: 0,
      overdue: 0,
      closed: 0
    };

    allLeads.forEach(lead => {
      const createdDate = new Date(lead.createdAt);
      const updatedDate = new Date(lead.updatedAt);
      const stageName = lead.pipelineStage?.stage_name?.toLowerCase() || '';

      if (createdDate >= sevenDaysAgo) {
        summary.newLeads++;
      }

      if (stageName === 'contacted' || stageName === 'proposal sent') {
        summary.scheduledLeads++;
      }

      if (updatedDate < thirtyDaysAgo && (stageName === 'open' || stageName === 'contacted')) {
        summary.overdue++;
      }

      if (stageName === 'deal done') {
        summary.closed++;
      }
    });

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching leads summary:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getLeadsEnhanced = async (req, res) => {
  try {
    const { page = 1, limit = 10, pipeline_id, stage_id, search } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const offset = (pageNum - 1) * limitNum;

    const whereClause = {};
    if (pipeline_id) {
      whereClause.sales_pipeline_id = pipeline_id;
    }
    if (stage_id) {
      whereClause.pipeline_stages_id = stage_id;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { lead_subject: { [Op.like]: `%${search}%` } },
        { "$salesPipeline.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const { count: totalLeads, rows: leads } = await Lead.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: SalesPipeline,
          as: "salesPipeline",
          attributes: ["name", "description"],
        },
        {
          model: PipelineStage,
          as: "pipelineStage",
        },
        {
          model: EmployeeModel,
          as: "salesPersonEmployee",
        },
      ],
      offset,
      limit: limitNum,
      order: [['createdAt', 'DESC']], 
    });

    res.status(200).json({
      totalLeads,
      currentPage: pageNum,
      totalPages: Math.ceil(totalLeads / limitNum),
      leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getEmployeesForFilter = async (req, res) => {
  try {
    const assignedEmployees = await Lead.findAll({
      attributes: ['sales_person', 'sales_person_id'],
      group: ['sales_person', 'sales_person_id'],
      where: {
        [Op.or]: [
          { sales_person: { [Op.ne]: null } },
          { sales_person_id: { [Op.ne]: null } }
        ]
      },
      include: [
        {
          model: EmployeeModel,
          as: 'salesPersonEmployee',
          attributes: ['id', 'personalDetails'],
          required: false
        }
      ]
    });

    const employees = assignedEmployees.map(lead => {
      if (lead.salesPersonEmployee) {
        const personalDetails = lead.salesPersonEmployee.personalDetails || {};
        return {
          id: lead.salesPersonEmployee.id,
          name: personalDetails.fullNameEnglish || personalDetails.fullNameArabic || `Employee ${lead.salesPersonEmployee.id}`,
          email: personalDetails.email
        };
      } else if (lead.sales_person) {
        return {
          id: lead.sales_person_id || 0,
          name: lead.sales_person,
          email: null
        };
      }
      return null;
    }).filter(Boolean);

    const uniqueEmployees = employees.filter((emp, index, arr) => 
      arr.findIndex(e => e.name === emp.name) === index
    );

    res.status(200).json({ employees: uniqueEmployees });
  } catch (error) {
    console.error('Error fetching employees for filter:', error);
    res.status(400).json({ error: error.message });
  }
};