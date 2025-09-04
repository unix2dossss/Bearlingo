import CV from "../models/CV.js";

// Saving or updating personal information in CV
export const addPersonalInformation = async (req, res) => {
    const userId = req.user._id; 
  try {
    const {
      firstName,
      lastName,
      contact,
      education,
      aboutMe,
    } = req.body;

    // Check if CV document exists for the user
    let cv = await CV.findOne({ userId });

    if (!cv) {
      // Create new CV if none exists
      cv = new CV({
        userId,
        firstName,
        lastName,
        contact,
        education,
        aboutMe,
      });
      await cv.save();
      return res.status(201).json({
        message: "CV created with personal information.",
        cv,
      });
    } else {
      // Update existing CV
      cv.firstName = firstName || cv.firstName;
      cv.lastName = lastName || cv.lastName;
      cv.contact = contact || cv.contact;
      cv.education = education || cv.education;
      cv.aboutMe = aboutMe || cv.aboutMe;

      await cv.save();
      return res.status(200).json({
        message: "Personal information updated successfully.",
        cv,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
