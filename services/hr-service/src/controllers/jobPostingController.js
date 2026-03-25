const JobPosting = require("../models/JobPostingModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// Helper function to generate unique job code
const generateJobCode = async (jobType, location) => {
  try {
    // Get current year and month
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month with leading zero
    
    // Get job type abbreviation
    const typeMap = {
      'Full-time': 'FT',
      'Part-time': 'PT',
      'Contract': 'CT',
      'Internship': 'IN',
      'Freelance': 'FL'
    };
    const typeCode = typeMap[jobType] || 'XX';
    
    // Get location abbreviation (first 3 letters, uppercase)
    const locationCode = location
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 3)
      .toUpperCase()
      .padEnd(3, 'X');
    
    // Find the last job posting to get the next sequential number
    const lastJob = await JobPosting.findOne({
      order: [['id', 'DESC']],
      attributes: ['jobCode']
    });
    
    let sequenceNumber = 1;
    if (lastJob && lastJob.jobCode) {
      // Extract the last 4 digits from the previous job code
      const match = lastJob.jobCode.match(/\d{4}$/);
      if (match) {
        const lastSequence = parseInt(match[0]);
        sequenceNumber = lastSequence + 1;
      }
    }
    
    // Format: JOB-YYMM-TYPE-LOC-XXXX
    // Example: JOB-2510-FT-DOH-0001
    const sequence = String(sequenceNumber).padStart(4, '0');
    return `JOB-${year}${month}-${typeCode}-${locationCode}-${sequence}`;
  } catch (error) {
    console.error("Error generating job code:", error);
    // Fallback to timestamp-based code if there's an error
    return `JOB-${Date.now()}`;
  }
};

const createJobPosting = async (req, res) => {
  const {
    jobTitle,
    jobDescription,
    location,
    salary,
    postedAt,
    expiresAt,
    jobType,
    responsibilities,
    keyRequirements,
    qualifications,
  } = req.body;

  const approvalStatus = "pending";

  try {
    // Generate job code before creating
    const jobCode = await generateJobCode(jobType, location);

    const jobPosting = await JobPosting.create({
      jobCode,
      jobTitle,
      jobDescription,
      location,
      salary,
      postedAt,
      expiresAt,
      jobType,
      approvalStatus,
      responsibilities,
      keyRequirements,
      qualifications,
    });

    res
      .status(201)
      .json({ message: "Job Post created successfully", jobPosting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJobposting = async (req, res) => {
  const { id } = req.params;
  const {
    jobTitle,
    jobDescription,
    location,
    salary,
    jobType,
    responsibilities,
    keyRequirements,
    qualifications,
  } = req.body;

  try {
    const jobPostingToUpdate = await JobPosting.findByPk(id);

    if (!jobPostingToUpdate) {
      return res.status(404).json({ message: "Job posting data not found" });
    }

    jobPostingToUpdate.jobTitle = jobTitle || jobPostingToUpdate.jobTitle;
    jobPostingToUpdate.jobDescription =
      jobDescription || jobPostingToUpdate.jobDescription;
    jobPostingToUpdate.location = location || jobPostingToUpdate.location;
    jobPostingToUpdate.salary = salary || jobPostingToUpdate.salary;
    jobPostingToUpdate.jobType = jobType || jobPostingToUpdate.jobType;
    jobPostingToUpdate.responsibilities = responsibilities || jobPostingToUpdate.responsibilities;
    jobPostingToUpdate.keyRequirements = keyRequirements || jobPostingToUpdate.keyRequirements;
    jobPostingToUpdate.qualifications = qualifications || jobPostingToUpdate.qualifications;

    // Regenerate job code if jobType or location changed
    if (jobType || location) {
      const newJobType = jobType || jobPostingToUpdate.jobType;
      const newLocation = location || jobPostingToUpdate.location;
      jobPostingToUpdate.jobCode = await generateJobCode(newJobType, newLocation);
    }

    await jobPostingToUpdate.save();
    res.status(200).json({
      message: "Job posting data updated successfully",
      recruitment: jobPostingToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating job posting data",
      error: error.message,
    });
  }
};

const deleteJobPosting = async (req, res) => {
  const { id } = req.params;

  try {
    const jobPostingToDelete = await JobPosting.findByPk(id);

    if (!jobPostingToDelete) {
      return res.status(404).json({ message: "Job posting data not found" });
    }

    await jobPostingToDelete.destroy();
    res.status(200).json({ message: "Job posting data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting job posting data",
      error: error.message,
    });
  }
};

const getJobPostingById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPosting = await JobPosting.findByPk(id);

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting data not found" });
    }

    res.status(200).json(jobPosting);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving job posting data",
      error: error.message,
    });
  }
};

const getAllJobPostings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalJobPostings, rows: jobPostings } =
      await JobPosting.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalJobPostings,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalJobPostings / limit),
      jobPostings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving job posting data",
      error: error.message,
    });
  }
};

const approveJobPosting = async (req, res) => {
  const { id } = req.params;

  try {
    const jobPosting = await JobPosting.findByPk(id);

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    jobPosting.approvalStatus = "approved";
    await jobPosting.save();

    res
      .status(200)
      .json({ message: "Job posting approved successfully", jobPosting });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving job posting", error: error.message });
  }
};

const rejectJobPosting = async (req, res) => {
  const { id } = req.params;

  try {
    const jobPosting = await JobPosting.findByPk(id);

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    jobPosting.approvalStatus = "rejected";
    await jobPosting.save();

    res
      .status(200)
      .json({ message: "Job posting rejected successfully", jobPosting });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting job posting", error: error.message });
  }
};

const filterJobPosting = async (req, res) => {
  try {
    const {
      jobType = "All",
      location = "All",
      approvalStatus = "All",
      expiresAt = "All",
      salary = "All",
      jobTitle = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (jobType !== "All") {
      where["jobType"] = jobType;
    }

    if (location !== "All") {
      where["location"] = location;
    }

    if (approvalStatus !== "All") {
      where["approvalStatus"] = approvalStatus;
    }

    if (expiresAt && expiresAt !== "All") {
      if (!isNaN(Date.parse(expiresAt))) {
        where["expiresAt"] = new Date(expiresAt);
      } else if (expiresAt.includes("to")) {
        const [startDate, endDate] = expiresAt
          .split("to")
          .map((date) => new Date(date.trim()));
        where["expiresAt"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (salary !== "All") {
      where["salary"] = salary;
    }

    if (jobTitle !== "All") {
      where["jobTitle"] = jobTitle;
    }

    const { count: totalJobPostings, rows: jobPostings } =
      await JobPosting.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalJobPostings,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalJobPostings / limit),
      jobPostings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering job postings", error: error.message });
  }
};

const exportFilteredJobPostingToCSV = async (req, res) => {
  try {
    const {
      jobType = "All",
      location = "All",
      approvalStatus = "All",
      expiresAt = "All",
      salary = "All",
      jobTitle = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (jobType !== "All") {
      where["jobType"] = jobType;
    }

    if (location !== "All") {
      where["location"] = location;
    }

    if (approvalStatus !== "All") {
      where["approvalStatus"] = approvalStatus;
    }

    if (expiresAt && expiresAt !== "All") {
      if (!isNaN(Date.parse(expiresAt))) {
        where["expiresAt"] = new Date(expiresAt);
      } else if (expiresAt.includes("to")) {
        const [startDate, endDate] = expiresAt
          .split("to")
          .map((date) => new Date(date.trim()));
        where["expiresAt"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (salary !== "All") {
      where["salary"] = salary;
    }

    if (jobTitle !== "All") {
      where["jobTitle"] = jobTitle;
    }

    const { rows: jobPostings } = await JobPosting.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    console.log(jobPostings);

    if (!jobPostings || jobPostings.length === 0) {
      return res.status(404).json({
        message: "No job posting found matching the filters",
      });
    }

    const jobPostingData = jobPostings.map((jobPostingz) => {
      return {
        jobPostingId: jobPostingz.id,
        jobCode: jobPostingz.jobCode,
        jobTitle: jobPostingz.jobTitle,
        jobDescription: jobPostingz.jobDescription,
        location: jobPostingz.location,
        salary: jobPostingz.salary,
        postedAt: jobPostingz.postedAt,
        expiresAt: jobPostingz.expiresAt,
        jobType: jobPostingz.jobType,
        approvalStatus: jobPostingz.approvalStatus,
        responsibilities: jobPostingz.responsibilities,
        keyRequirements: jobPostingz.keyRequirements,
        qualifications: jobPostingz.qualifications,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(jobPostingData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_jobPostings.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting job postings to CSV:", error);
    res.status(500).json({
      message: "Error exporting job postings to CSV",
      error: error.message,
    });
  }
};

const exportFilteredJobPostingToPDF = async (req, res) => {
  try {
    const {
      jobType = "All",
      location = "All",
      approvalStatus = "All",
      expiresAt = "All",
      salary = "All",
      jobTitle = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (jobType !== "All") {
      where["jobType"] = jobType;
    }

    if (location !== "All") {
      where["location"] = location;
    }

    if (approvalStatus !== "All") {
      where["approvalStatus"] = approvalStatus;
    }

    if (expiresAt && expiresAt !== "All") {
      if (!isNaN(Date.parse(expiresAt))) {
        where["expiresAt"] = new Date(expiresAt);
      } else if (expiresAt.includes("to")) {
        const [startDate, endDate] = expiresAt
          .split("to")
          .map((date) => new Date(date.trim()));
        where["expiresAt"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (salary !== "All") {
      where["salary"] = salary;
    }

    if (jobTitle !== "All") {
      where["jobTitle"] = jobTitle;
    }

    const { rows: jobPostings } = await JobPosting.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!jobPostings || jobPostings.length === 0) {
      return res
        .status(404)
        .json({ message: "No job posting found matching the filters" });
    }

    const jobPostingData = jobPostings.map((jobPostingz) => {
      return [
        jobPostingz.id || "N/A",
        jobPostingz.jobCode || "N/A",
        jobPostingz.jobTitle || "N/A",
        jobPostingz.location || "N/A",
        jobPostingz.salary || "N/A",
        jobPostingz.jobType || "N/A",
        jobPostingz.approvalStatus || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Job Posting Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [50, 80, "*", "*", "*", "*", "*"],
            body: [
              [
                "ID",
                "Job Code",
                "Job Title",
                "Location",
                "Salary",
                "Job Type",
                "Status",
              ],
              ...jobPostingData,
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
    res.attachment("jobPosting_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting job postings to PDF:", error);
    res.status(500).json({
      message: "Error exporting job postings to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createJobPosting,
  updateJobposting,
  deleteJobPosting,
  getJobPostingById,
  getAllJobPostings,
  approveJobPosting,
  rejectJobPosting,
  filterJobPosting,
  exportFilteredJobPostingToCSV,
  exportFilteredJobPostingToPDF,
};