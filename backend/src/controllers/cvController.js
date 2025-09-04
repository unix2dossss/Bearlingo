import CV from "../models/CV.js";
import { buildCVHtml } from "../utils/buildCVHtml.js";
import { isWithinMaxSentences } from "../utils/helpers.js";
import puppeteer from "puppeteer";

// Saving or updating personal information in CV
export const addPersonalInformation = async (req, res) => {
  const userId = req.user._id;
  try {
    const { firstName, lastName, contact, education, aboutMe } = req.body;

    // Validate aboutMe paragraph: max 5 sentences
    if (!isWithinMaxSentences(aboutMe, 5)) {
      return res.status(400).json({ message: "About me section must be at most 5 sentences." });
    }

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
        aboutMe
      });
      await cv.save();
      return res.status(201).json({
        message: "CV created with personal information.",
        cv
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
        cv
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Saving or updating skills in CV
export const addSkills = async (req, res) => {
  const userId = req.user._id;
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array!" });
    }

    if (skills.length > 8) {
      return res.status(400).json({ message: "You can add up to 8 skills only!" });
    }

    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res.status(404).json({ message: "CV not found. Complete personal info first!" });
    }

    cv.skills = skills;
    await cv.save();

    res.status(200).json({ message: "Skills saved successfully!", skills: cv.skills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Saving or updating projects in CV
export const addProjects = async (req, res) => {
  const userId = req.user._id;
  try {
    const { projects } = req.body;

    if (!projects || !Array.isArray(projects)) {
      return res.status(400).json({ message: "Projects must be an array." });
    }

    if (projects.length > 3) {
      return res.status(400).json({ message: "You can add up to 3 projects only." });
    }

    // Validate outcome and roleContribution sentences
    for (const project of projects) {
      if (!isWithinMaxSentences(project.outcome, 2)) {
        return res.status(400).json({
          message: `Project "${project.name}" outcome must be at most 2 sentences.`
        });
      }
      if (!isWithinMaxSentences(project.roleContribution, 2)) {
        return res.status(400).json({
          message: `Project "${project.name}" roleContribution must be at most 2 sentences.`
        });
      }
    }

    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res.status(404).json({ message: "CV not found. Complete personal info first." });
    }

    cv.projects = projects;
    await cv.save();

    res.status(200).json({ message: "Projects saved successfully.", projects: cv.projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Saving or updating work experience in CV
export const addWorkExperience = async (req, res) => {
  const userId = req.user._id;
  try {
    const { experiences } = req.body;

    if (!experiences || !Array.isArray(experiences)) {
      return res.status(400).json({ message: "Experiences must be an array." });
    }

    if (experiences.length > 4) {
      return res.status(400).json({ message: "You can add up to 4 experiences only." });
    }

    // Validate contribution sentences
    for (const exp of experiences) {
      if (!isWithinMaxSentences(exp.contribution, 3)) {
        return res.status(400).json({
          message: `Experience at "${exp.company}" contribution must be at most 3 sentences.`
        });
      }
    }

    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res.status(404).json({ message: "CV not found. Complete personal info first." });
    }

    cv.experiences = experiences;
    await cv.save();

    res
      .status(200)
      .json({ message: "Experiences updated successfully.", experiences: cv.experiences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetching the complete CV for the logged-in user
export const getCV = async (req, res) => {
  const userId = req.user._id;
  try {
    const cv = await CV.findOne({ userId });

    if (!cv) {
      return res.status(404).json({ message: "CV not found. Please create one first." });
    }
    res.status(200).json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Getting CV preview
export const getPreviewCV = async (req, res) => {
  const userId = req.user._id;
  try {
    const cv = await CV.findOne({ userId });
    if (!cv) return res.status(404).send("CV not found");

    const html = buildCVHtml(cv);

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Handling download requests and returning CV as a PDF
export const downloadCV = async (req, res) => {
  const userId = req.user._id;
  try {
    const cv = await CV.findOne({ userId });
    if (!cv) return res.status(404).send("CV not found");

    // Turn the CV data into HTML (using buildCVHtml helper function)
    const html = buildCVHtml(cv);

    // Start a new invisible (headless) browser
    const browser = await puppeteer.launch();
    // Open a blank page in that browser
    const page = await browser.newPage();
    // Put the HTML content into the page
    // waitUntil: "networkidle0" = wait until the page has finished loading things (like CSS/images)
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Make a PDF from the page
    // format: "A4" = standard page size
    // printBackground: true = include background colors/styles in PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    // Close the invisible browser
    await browser.close();

    // Tell the browser this is a PDF file and should be downloaded
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=cv.pdf"
    });

    // Send the actual PDF file to the browser
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating CV PDF");
  }
};
