import CompanyResearch from "../models/CompanyResearch.js";
import InterviewPrepRecord from "../models/InterviewPrepRecord.js";

// Adding user company-research details
export const addCompanyResearch = async (req, res) => {
  const userId = req.user._id;
  try {
    const { companyName, industry, products, competitors, questions } = req.body;

    // Create new CompanyResearch doc
    const companyResearch = new CompanyResearch({
      user: userId,
      companyName,
      industry,
      products,
      competitors,
      questions
    });
    await companyResearch.save();

    // Find or create InterviewPrepRecord for the user
    let record = await InterviewPrepRecord.findOne({ user: userId });
    if (!record) {
      record = new InterviewPrepRecord({
        user: userId,
        companyResearches: [companyResearch._id]
      });
    } else {
      record.companyResearches.push(companyResearch._id);
    }
    await record.save();

    res.status(200).json({
      message: "Company research saved successfully",
      companyResearch: companyResearch
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving company research", error: error.message });
  }
};

// Getting user company-research details
export const getCompanyResearches = async (req, res) => {
  const userId = req.user._id;
  try {
    const record = await InterviewPrepRecord.findOne({ user: userId }).populate(
      "companyResearches"
    );

    if (!record) {
      return res.status(404).json({ message: "No company research found for this user" });
    }
    res.status(200).json(record.companyResearches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company researches", error: error.message });
  }
};

// Deleting user company-research by id
export const deleteCompanyResearch = async (req, res) => {
  const userId = req.user._id;
  try {
    const { id } = req.params;

    const companyResearch = await CompanyResearch.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!companyResearch) {
      return res.status(404).json({ message: "Company research not found or already deleted" });
    }

    // Remove reference from InterviewPrepRecord
    await InterviewPrepRecord.findOneAndUpdate(
      { user: userId },
      { $pull: { companyResearches: id } }
    );

    res.status(200).json({ message: "Company research deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company research", error: error.message });
  }
};
