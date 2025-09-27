import pdfParse from "pdf-parse";
import mammoth from "mammoth";

// Parse PDF buffer → text
export const parsePDF = async (buffer) => {
    console.log("pdfParse type:", typeof pdfParse, pdfParse); // should print "function"
  const data = await pdfParse(buffer);
  return data.text;
}

// Parse DOCX buffer → text
export const parseDOCX = async(buffer) => {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}

// Very basic JSON Resume skeleton
export const createResumeSkeleton = (rawText, userId) => {
  return {
    basics: {
      name: "Unknown User",
      email: "unknown@example.com"
    },
    work: [],
    education: [],
    skills: [],
    meta: {
      userId,
      extractedFrom: "upload",
      rawText // keep original text for later mapping
    }
  };
}