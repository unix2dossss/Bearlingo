import CV from "../models/CV.js";
import User from "../models/User.js";
import { buildCVHtml } from "../utils/buildCVHtml.js";
import { isWithinMaxSentences, hasChanged, updateUserStreak } from "../utils/helpers.js";
import puppeteer from "puppeteer";
import { parsePDF, parseDOCX, createResumeSkeleton } from "../utils/cvBuilderHelpers.js";
import { pipeline } from "@xenova/transformers";
import PDFDocument from "pdfkit";

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";
// import { GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Saving or updating personal information in CV
export const addPersonalInformation = async (req, res) => {
  const userId = req.user._id;
  try {
    const { firstName, lastName, contact, education, aboutMe } = req.body;

    // Validate aboutMe paragraph: max 5 sentences
    if (!isWithinMaxSentences(aboutMe, 5)) {
      return res.status(400).json({ message: "About me section must be at most 5 sentences." });
    }

    const user = await User.findById(userId);
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
      // // Determine if any meaningful change was made to aboutMe
      // const aboutMeChanged = cv.aboutMe && hasChanged(cv.aboutMe, aboutMe);

      // Update existing CV
      cv.firstName = firstName || cv.firstName;
      cv.lastName = lastName || cv.lastName;
      cv.contact = contact || cv.contact;
      cv.education = education || cv.education;
      cv.aboutMe = aboutMe || cv.aboutMe;
      await cv.save();

      // // Update streak + give +5xp only if aboutMe actually changed
      // if (aboutMeChanged) {
      //   updateUserStreak(user);
      //   user.xp += 5;
      //   await user.save();
      // }

      // return res.status(200).json({
      //   message: `Personal information updated successfully.${aboutMeChanged ? " +5 XP awarded for updating aboutMe." : ""}`,
      //   cv
      // });
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

    const user = await User.findById(userId);
    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res.status(404).json({ message: "CV not found. Complete personal info first!" });
    }

    // // Track if user had skills before
    // const hadSkills = cv.skills && cv.skills.length > 0;
    // const skillsChanged = hasChanged(cv.skills, skills);

    // Update skills in CV
    cv.skills = skills;
    await cv.save();

    // let xpAwarded = false;

    // // Case 1: First time adding skills → streak only
    // if (!hadSkills && skills.length > 0) {
    //   updateUserStreak(user);
    //   await user.save();
    // }
    // // Case 2: Updating existing skills with changes → streak + XP
    // else if (hadSkills && skillsChanged) {
    //   updateUserStreak(user);
    //   user.xp += 5;
    //   xpAwarded = true;
    //   await user.save();
    // }

    // res.status(200).json({
    //   message: `Skills saved successfully!${xpAwarded ? " +5 XP awarded for updating skills." : ""}`,
    //   skills: cv.skills
    // });
    res.status(200).json({
      message: "Skills saved successfully!",
      skills: cv.skills
    });
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

    const user = await User.findById(userId);
    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res.status(404).json({ message: "CV not found. Complete personal info first." });
    }

    // // Track if user had projects before
    // const hadProjects = cv.projects && cv.projects.length > 0;
    // const projectsChanged = hasChanged(cv.projects, projects);

    // Update projects in CV
    cv.projects = projects;
    await cv.save();

    // let xpAwarded = false;

    // // Case 1: First time adding projects → streak only
    // if (!hadProjects && projects.length > 0) {
    //   updateUserStreak(user);
    //   await user.save();
    // }
    // // Case 2: Updating existing projects with changes → streak + XP
    // else if (hadProjects && projectsChanged) {
    //   updateUserStreak(user);
    //   user.xp += 5;
    //   xpAwarded = true;
    //   await user.save();
    // }

    // res.status(200).json({
    //   message: `Projects saved successfully.${xpAwarded ? " +5 XP awarded for updating projects." : ""}`,
    //   projects: cv.projects
    // });
    res.status(200).json({
      message: "Projects saved successfully.",
      projects: cv.projects
    });
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

    const user = await User.findById(userId);
    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res.status(404).json({ message: "CV not found. Complete personal info first." });
    }

    // // Track if user had experiences before
    // const hadExperiences = cv.experiences && cv.experiences.length > 0;
    // const experiencesChanged = hasChanged(cv.experiences, experiences);

    // Update experiences in CV
    cv.experiences = experiences;
    await cv.save();

    // let xpAwarded = false;

    // // Case 1: First time adding experiences → streak only
    // if (!hadExperiences && experiences.length > 0) {
    //   updateUserStreak(user);
    //   await user.save();
    // }
    // // Case 2: Updating existing experiences with changes → streak + XP
    // else if (hadExperiences && experiencesChanged) {
    //   updateUserStreak(user);
    //   user.xp += 5;
    //   xpAwarded = true;
    //   await user.save();
    // }

    // res.status(200).json({
    //   message: `Experiences updated successfully.${xpAwarded ? " +5 XP awarded for updating experiences." : ""}`,
    //   experiences: cv.experiences
    // });
    res.status(200).json({
      message: "Experiences updated successfully.",
      experiences: cv.experiences
    });
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
      return res.status(200).json({ message: "CV not found. Please create one first." });
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
      printBackground: true,
      margin: {
        top: "0.4in",
        bottom: "0.2in",
        left: "0.2in",
        right: "0.2in"
      }
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

// PDF CV upload logics

// Upload CV to S3 bucket (for large CVs + production)
// const s3 = new S3Client({
//   region: process.env.AWS_REGION, // e.g. "ap-southeast-2"
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//   }
// });

export const uploadCV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Check PDF header magic bytes to confirm it's a valid PDF
    const header = req.file.buffer.slice(0, 5).toString("utf8");
    if (!header.startsWith("%PDF")) {
      return res.status(400).json({ message: "Invalid PDF file" });
    }

    // Parse PDF/DOC/DOCX into raw text
    let rawText = "";
    if (req.file.mimetype === "application/pdf") {
      rawText = await parsePDF(req.file.buffer);
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      rawText = await parseDOCX(req.file.buffer);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Create JSON Resume skeleton
    const resumeJSON = createResumeSkeleton(rawText, req.user._id);

    console.log("Uploaded file:", req.file);
    console.log("File mimetype:", req.file?.mimetype);

    // Unique S3 key
    // const key = `cvs/${req.user._id}/${uuidv4()}-${req.file.originalname}.pdf`;

    // const uploadParams = {
    //   Bucket: process.env.S3_BUCKET,
    //   Key: key,
    //   Body: req.file.buffer,
    //   ContentType: "application/pdf"
    // };

    // await s3.send(new PutObjectCommand(uploadParams));

    // Update CV record in DB
    let cv = await CV.findOne({ userId: req.user._id });
    if (!cv) {
      cv = new CV({
        userId: req.user._id,
        firstName: req.body.firstName || "Unknown",
        lastName: req.body.lastName || "Unknown"
      });
    }
    // cv.cvUrl = key; // Store S3 key in CV record
    cv.cvFile = {
      data: req.file.buffer,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date()
    };

    cv.rawText = rawText; // Save extracted text
    cv.resumeJSON = resumeJSON; // Save JSON Resume skeleton

    await cv.save();

    res.json({ message: "CV uploaded successfully", cv });
  } catch (err) {
    console.error("S3 upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// For small CVs, just store in DB
export const getPdfCVFromDB = async (req, res) => {
  const cv = await CV.findOne({ userId: req.user.id }).lean();
  if (!cv || !cv.cvFile || !cv.cvFile.data) {
    return res.status(404).json({ message: "CV not found" });
  }

  const { filename, contentType, data } = cv.cvFile;
  res.setHeader("Content-Type", contentType || "application/pdf");
  // Force download:
  res.setHeader("Content-Disposition", `attachment; filename="${filename || "cv.pdf"}"`);
  res.send(data); // Buffer will be sent
};

// For large CVs + production
// const downloadCVFromS3 = async (req, res) => {
//   try {
//     const cv = await CV.findOne({ userId: req.user._id });
//     if (!cv || !cv.cvUrl) {
//       return res.status(404).json({ message: "No CV found" });
//     }

//     // Generate signed URL valid for 60 seconds
//     const command = new GetObjectCommand({
//       Bucket: process.env.S3_BUCKET,
//       Key: cv.cvUrl
//     });
//     const url = await getSignedUrl(s3, command, { expiresIn: 60 });

//     res.json({ downloadUrl: url });
//   } catch (err) {
//     console.error("Download error:", err);
//     res.status(500).json({ message: "Could not generate download link" });
//   }
// };

// CV improvement feedback
export const getFeedback = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user._id });
    if (!cv) return res.status(404).json({ message: "CV not found" });

    const text = cv.rawText;
    let feedback = [];

    // Simple rules
    if (!text.toLowerCase().includes("experience")) feedback.push("Add a Work Experience section.");
    if (!text.toLowerCase().includes("education")) feedback.push("Add an Education section.");
    if (!text.toLowerCase().includes("skills"))
      feedback.push("Add Skills section with relevant keywords.");

    // Save feedback in DB for reference
    cv.feedback = feedback;
    await cv.save();

    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating feedback" });
  }
};

let generator;
(async () => {
  // Load a text generation model
  generator = await pipeline("text-generation", "Xenova/gpt2");
})();

// Uses free HuggingFace GPT-2 model locally to rewrite bullets
export const rewriteCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user._id });
    if (!cv) return res.status(404).json({ message: "CV not found" });

    const rawText = cv.rawText || "";

    // Split raw text into lines / bullet points
    const bullets = rawText.split("\n").filter((line) => line.trim().length > 5);

    const improvedBullets = [];

    // Rewrite each bullet using AI
    for (let bullet of bullets) {
      const result = await generator(`Improve this CV point: ${bullet}`, { max_new_tokens: 30 });
      const improved = result[0].generated_text.replace("Improve this CV point: ", "").trim();
      improvedBullets.push(improved);
    }

    // Save improved bullets in improvedText (optional)
    cv.improvedText = improvedBullets.join("\n");

    // Map improved bullets into resumeJSON.work.summary
    // If work entries exist, update them sequentially
    if (cv.resumeJSON.work && cv.resumeJSON.work.length > 0) {
      cv.resumeJSON.work.forEach((job, index) => {
        // Map one improved bullet per job, or append if multiple bullets
        job.summary = improvedBullets[index] || job.summary || "";
      });
    } else {
      // If no work section exists, create one with improved bullets
      cv.resumeJSON.work = improvedBullets.map((bullet) => ({
        position: "Position",
        company: "Company",
        startDate: "",
        endDate: "",
        summary: bullet
      }));
    }

    await cv.save();

    res.json({
      message: "CV rewritten and mapped to resumeJSON successfully",
      resumeJSON: cv.resumeJSON
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rewriting CV" });
  }
};

// Returns structured JSON Resume for template generation
export const getJSONResume = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user._id });
    if (!cv) return res.status(404).json({ message: "CV not found" });

    // You could later map improvedText to resumeJSON fields
    res.json(cv.resumeJSON);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching JSON Resume" });
  }
};

// Generates PDF from JSON Resume template and returns it
export const generatePDF = async (req, res) => {
  try {
    // 1. Find CV for current user
    const cv = await CV.findOne({ userId: req.user._id });
    if (!cv) return res.status(404).json({ message: "CV not found" });

    const resume = cv.resumeJSON;

    // 2. Create a PDF document
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Set headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${cv.cvFile.filename}-improved.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Pipe PDF to response
    doc.pipe(res);

    // 3. Add Name & Email
    doc.fontSize(20).text(resume.basics?.name || "No Name", { underline: true });
    doc.fontSize(12).text(resume.basics?.email || "No Email");
    doc.moveDown();

    // 4. Add Work Experience
    if (resume.work && resume.work.length > 0) {
      doc.fontSize(16).text("Work Experience", { underline: true });
      resume.work.forEach((job) => {
        doc
          .fontSize(12)
          .text(
            `${job.position || "Position"} at ${job.company || "Company"} (${job.startDate || ""} - ${job.endDate || ""})`
          );
        if (job.summary) doc.text(`  • ${job.summary}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // 5. Add Education
    if (resume.education && resume.education.length > 0) {
      doc.fontSize(16).text("Education", { underline: true });
      resume.education.forEach((edu) => {
        doc
          .fontSize(12)
          .text(
            `${edu.studyType || "Degree"} at ${edu.institution || "Institution"} (${edu.startDate || ""} - ${edu.endDate || ""})`
          );
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // 6. Add Skills
    if (resume.skills && resume.skills.length > 0) {
      doc.fontSize(16).text("Skills", { underline: true });
      doc.fontSize(12).text(resume.skills.join(", "));
      doc.moveDown();
    }

    // 7. Optional: Add Improved Text (from AI rewriting)
    if (cv.improvedText) {
      doc.addPage();
      doc.fontSize(16).text("Improved / Suggested CV Points", { underline: true });
      doc.fontSize(12).text(cv.improvedText);
    }

    // 8. Finalize PDF
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

export const improveCV = async (req, res) => {
  try {
    // 1️⃣ Fetch user's CV
    const cv = await CV.findOne({ userId: req.user._id });
    if (!cv) return res.status(404).json({ message: "CV not found" });

    const text = cv.rawText || "";

    // 2️⃣ Generate simple feedback (rule-based)
    const feedback = [];
    if (!text.toLowerCase().includes("experience")) feedback.push("Add a Work Experience section.");
    if (!text.toLowerCase().includes("education")) feedback.push("Add an Education section.");
    if (!text.toLowerCase().includes("skills"))
      feedback.push("Add Skills section with relevant keywords.");
    cv.feedback = feedback;

    // 3️⃣ Rewrite bullets using AI
    const bullets = text.split("\n").filter((line) => line.trim().length > 5);
    const improvedBullets = [];
    for (let bullet of bullets) {
      const result = await generator(`Improve this CV point: ${bullet}`, { max_new_tokens: 30 });
      const improved = result[0].generated_text.replace("Improve this CV point: ", "").trim();
      improvedBullets.push(improved);
    }
    cv.improvedText = improvedBullets.join("\n");

    // 4️⃣ Map improved bullets into resumeJSON.work.summary
    if (cv.resumeJSON.work && cv.resumeJSON.work.length > 0) {
      cv.resumeJSON.work.forEach((job, index) => {
        job.summary = improvedBullets[index] || job.summary || "";
      });
    } else {
      cv.resumeJSON.work = improvedBullets.map((bullet) => ({
        position: "Position",
        company: "Company",
        startDate: "",
        endDate: "",
        summary: bullet
      }));
    }

    // Save updates
    await cv.save();

    // 5️⃣ Generate PDF using pdfkit
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${cv.cvFile.filename}-improved.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    const resume = cv.resumeJSON;

    // Add basics
    doc.fontSize(20).text(resume.basics?.name || "No Name", { underline: true });
    doc.fontSize(12).text(resume.basics?.email || "No Email");
    doc.moveDown();

    // Add Work
    if (resume.work && resume.work.length > 0) {
      doc.fontSize(16).text("Work Experience", { underline: true });
      resume.work.forEach((job) => {
        doc
          .fontSize(12)
          .text(
            `${job.position || "Position"} at ${job.company || "Company"} (${job.startDate || ""} - ${job.endDate || ""})`
          );
        if (job.summary) doc.text(`  • ${job.summary}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      doc.fontSize(16).text("Education", { underline: true });
      resume.education.forEach((edu) => {
        doc
          .fontSize(12)
          .text(
            `${edu.studyType || "Degree"} at ${edu.institution || "Institution"} (${edu.startDate || ""} - ${edu.endDate || ""})`
          );
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      doc.fontSize(16).text("Skills", { underline: true });
      doc.fontSize(12).text(resume.skills.join(", "));
      doc.moveDown();
    }

    // Optional: Add feedback at the end
    if (feedback.length > 0) {
      doc.addPage();
      doc.fontSize(16).text("CV Feedback", { underline: true });
      feedback.forEach((f) => doc.fontSize(12).text(`• ${f}`));
    }

    doc.end(); // finalize PDF
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error improving CV" });
  }
};
