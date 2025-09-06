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
      companyResearch: companyResearch,
      
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving company research", error: error.message });
  }
};
