import CV from "../models/CV.js";
import User from "../models/User.js";
import { buildCVHtml } from "../utils/buildCVHtml.js";
import { isWithinMaxSentences, hasChanged, updateUserStreak } from "../utils/helpers.js";
import puppeteer from "puppeteer";
import pdf from "pdf-parse/lib/pdf-parse.js";
import OpenAI from "openai";
import { toFile } from "openai/uploads";
import env from "dotenv";
env.config();

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

    let resumeText = "";
    const fileBuffer = req.file.buffer;

    try {
      // --- STEP 1: EXTRACT TEXT FROM THE UPLOADED FILE ---
      if (req.file.mimetype === "application/pdf") {
        const data = await pdf(fileBuffer);
        resumeText = data.text;
      } else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const docxResult = await extractRawText(fileBuffer);
        resumeText = docxResult.value;
      } else {
        return res
          .status(400)
          .json({ message: "Unsupported file type. Please upload a PDF or DOCX file." });
      }

      if (!resumeText.trim()) {
        return res.status(400).json({
          message: "Could not extract text from the document. The file might be empty or corrupted."
        });
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while extracting text from the document." });
    }

    // Update CV record in DB
    let cv = await CV.findOne({ userId: req.user._id });
    if (!cv) {
      cv = new CV({
        userId: req.user._id,
        firstName: req.body.firstName || "Unknown",
        lastName: req.body.lastName || "Unknown"
      });
    }
    cv.cvFile = {
      data: req.file.buffer,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date()
    };
    cv.resumeText = resumeText;
    await cv.save();

    res.json({ message: "CV uploaded successfully", cv });
  } catch (err) {
    console.error("S3 upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// Delete cvFile (has CV PDF information) from CV record
export const deleteCV = async (req, res) => {
  try {
    const userId = req.user._id;
    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }
    cv.cvFile = null;
    await cv.save();
    res.json({ message: "CV deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
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

// Analyze CV and give feedback
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
console.log("OpenAI key: ", process.env.OPENAI_KEY);

export const analyzeCV = async (req, res) => {
  const userId = req.user._id;
  try {
    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res
        .status(404)
        .json({ error: "No CV found. Please upload or fill out the form first." });
    }

    let pdfBuffer;
    let filename = "resume.pdf";

    // Case 1: If user uploaded a CV file
    if (cv.cvFile && cv.cvFile.data) {
      pdfBuffer = cv.cvFile.data;
      // If a filename exists on the uploaded file, use it
      filename = cv.cvFile.filename || "resume.pdf"; // use the uploaded filename
      if (!filename.toLowerCase().endsWith(".pdf")) {
        filename += ".pdf"; // make sure it ends with .pdf
      }
    } else {
      // Case 2: If user filled the form → build PDF
      const html = buildCVHtml(cv);
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0.4in", bottom: "0.2in", left: "0.2in", right: "0.2in" }
      });
      await browser.close();
    }

    // Upload the PDF to OpenAI
    const file = await openai.files.create({
      file: await toFile(pdfBuffer, filename),
      purpose: "assistants"
    });

    // Ask OpenAI for feedback
    const resp = await openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `You are a professional career coach. Analyze the provided CV and return ONLY valid JSON with this exact structure (no explanations, no extra text outside JSON):
{
  "strengths": ["point 1", "point 2", ...],
  "weaknesses": ["point 1", "point 2", ...],
  "suggestions": ["point 1", "point 2", ...],
  "missing": ["point 1", "point 2", ...],
  "score": <overall score out of 100>
}
**IMPORTANT RULE:** If the CV is sparse, nearly empty, or contains only placeholder text like "testing" or "lorem ipsum", do not refuse the request. Instead, treat this as a very poorly constructed CV. 
- Give it a very low score (under 10).
- The "strengths" array should be empty.
- The "weaknesses", "suggestions", and "missing" arrays should be filled with feedback explaining what is wrong or absent (e.g., "The CV lacks any personal details", "No work experience is listed", "Contact information is missing", "The skills section is undefined").
For each field ("strengths", "weaknesses", "suggestions", "missing"), list up to 5 points. If there are fewer relevant points, include only what applies. Be concise and truthful.`
            },
            { type: "input_file", file_id: file.id }
          ]
        }
      ]
    });

    const feedback =
      resp.output_text ||
      (resp.output?.[0]?.content || []).find((c) => c.type === "output_text")?.text ||
      "No feedback generated.";
    console.log("Feedback:", feedback);

    let cleanFeedback = feedback.trim();

    // Remove ``` or ```json wrappers if present
    if (cleanFeedback.startsWith("```")) {
      cleanFeedback = cleanFeedback.replace(/```(?:json)?/g, "").trim();
    } else {
      return res.json(cleanFeedback);
    }

    let feedbackJson;
    try {
      feedbackJson = JSON.parse(cleanFeedback);
    } catch (err) {
      console.error("JSON parse error:", err);
      feedbackJson = {
        error: "Failed to get structured feedback from the analysis service.",
        strengths: [],
        weaknesses: [
          "The AI model could not process the CV. This often happens if the document is empty or unreadable."
        ],
        suggestions: ["Please ensure your CV has meaningful content and try again."],
        missing: ["All sections appear to be missing or unreadable."],
        score: 0
      };
    }
    console.log("Cleaned Feedback JSON:", feedbackJson);
    res.json({ feedback: feedbackJson });
  } catch (err) {
    console.error("Error analyzing CV:", err);
    res.status(500).json({ error: "Error analyzing CV" });
  }
};
