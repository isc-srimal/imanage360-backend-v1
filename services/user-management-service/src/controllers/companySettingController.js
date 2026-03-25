const CompanyProfileModel = require('../models/CompanyProfileModel');

//Get Company details
const getCompanyDetails = async(req, res) => {
   try {
    const { id } = req.params;
    const companyDetails = await CompanyProfileModel.findByPk(id);

    
    if (!companyDetails) {
        return res.status(404).json({ message: 'Company Details not found' });
      }
  
      res.status(200).json(companyDetails);
    
   } catch (error) {
    res.status(500).json({ message: 'Error retrieving Company details', error: error.message });
   }
};

// Update Company details
const updateCompanyDetails = async (req, res) => {
  const { id } = req.params;
  const { companyName, address, logoUrl } = req.body;

  try {
    const companyToUpdate = await CompanyProfileModel.findByPk(id);

    if (!companyToUpdate) {
      return res.status(404).json({ message: 'Company details not found' });
    }

    // Update company details
    companyToUpdate.companyName = companyName || companyToUpdate.companyName;
    companyToUpdate.address = address || companyToUpdate.address;
    companyToUpdate.logoUrl = logoUrl || companyToUpdate.logoUrl;

    await companyToUpdate.save();
    res.status(200).json({ message: 'User updated successfully', user: companyToUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

module.exports = { getCompanyDetails, updateCompanyDetails };