// Converting a CV document into HTML
export const buildCVHtml = (cv) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cv.firstName} ${cv.lastName} - CV</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      font-family: 'Inter', sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      padding: 2rem;
    }

    @page {
      size: A4;
      margin: 0.5cm;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1f2937;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: #374151;
    }

    .section {
      background-color: #fff;
      /* border-radius: 0.5rem; */
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
      /* box-shadow: 0 1px 3px rgba(0,0,0,0.1); */
      break-inside: auto; /* allow section to break across pages */
    }

    .badge {
      display: inline-block;
      background-color: #f3f4f6;
      color: #4b5563;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      margin-right: 0.25rem;
      margin-bottom: 0.25rem;
    }

    .date-badge {
      background-color: #f3f4f6;
      color: #6b7280;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
    }

    .separator {
      border-top: 1px solid #e5e7eb;
      margin: 1.5rem 0;
    }
  </style>
</head>
<body class="bg-gray-50 text-gray-800 print:bg-white">
  <div class="container mx-auto max-w-4xl space-y-6">

    <!-- Header Section -->
    <div class="section text-center">
      <h1>${cv.firstName} ${cv.lastName}</h1>
      <div class="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-2">
        <div>${cv.contact.email}</div>
        <div>${cv.contact.phone}</div>
        <div>${cv.contact.linkedin || ""}</div>
      </div>
    </div>

    <!-- About Me -->
    <div class="section">
      <h2>About Me</h2>
      <p class="text-sm leading-relaxed text-gray-600">${cv.aboutMe}</p>
    </div>

    <!-- Skills -->
    <div class="section">
      <h2>Skills</h2>
      <div class="flex flex-wrap gap-2">
        ${cv.skills.map((skill) => `<span class="badge">${skill}</span>`).join("")}
      </div>
    </div>

    <!-- Work Experience -->
    <div class="section">
      <h2>Work Experience</h2>
      <div class="space-y-4">
        ${cv.experiences
          .map(
            (exp) => `
          <div>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
              <div>
                <h3 class="font-semibold text-gray-800">${exp.role}</h3>
                <p class="text-sm text-gray-700 font-medium">${exp.company}</p>
              </div>
              <span class="date-badge mt-1 sm:mt-0">${exp.startYear} - ${exp.endYear}</span>
            </div>
            <p class="text-sm leading-relaxed text-gray-600">${exp.contribution}</p>
          </div>
        `
          )
          .join('<div class="separator"></div>')}
      </div>
    </div>

    <!-- Projects -->
    <div class="section">
      <h2>Projects</h2>
      <div class="space-y-4">
        ${cv.projects
          .map(
            (p) => `
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-gray-800">${p.name}</h3>
              ${p.link ? `<a href="${p.link}" class="text-blue-500 hover:text-blue-700" target="_blank">GitHub</a>` : ""}
            </div>
            <p class="text-sm text-gray-600"><strong>Outcome:</strong> ${p.outcome}</p>
            <p class="text-sm text-gray-600"><strong>Role:</strong> ${p.roleContribution}</p>
          </div>
        `
          )
          .join('<div class="separator"></div>')}
      </div>
    </div>

    <!-- Education -->
    <div class="section">
      <h2>Education</h2>

      <!-- Tertiary -->
      <div class="mb-4">
        <h3 class="font-semibold text-gray-800 mb-2">Higher Education</h3>
        ${cv.education.tertiary
          .map(
            (ed) => `
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
            <div>
              <p class="font-medium">${ed.degree}</p>
              <p class="text-sm text-gray-600">${ed.university}</p>
            </div>
            <span class="date-badge mt-1 sm:mt-0">${ed.startYear} - ${ed.endYear}</span>
          </div>
        `
          )
          .join("")}
      </div>

      <div class="separator"></div>

      <!-- Secondary -->
      <div>
        <h3 class="font-semibold text-gray-800 mb-2">Secondary Education</h3>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <div><p class="font-medium">${cv.education.secondary.schoolName}</p></div>
          <span class="date-badge mt-1 sm:mt-0">${cv.education.secondary.startYear} - ${cv.education.secondary.endYear}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-medium mb-1 text-gray-700">Key Subjects:</p>
            <div class="text-gray-600 space-y-1">
              ${cv.education.secondary.subjects.map((s) => `<div>• ${s}</div>`).join("")}
            </div>
          </div>
          <div>
            <p class="font-medium mb-1 text-gray-700">Achievements:</p>
            <div class="text-gray-600 space-y-1">
              ${cv.education.secondary.achievements.map((a) => `<div>• ${a}</div>`).join("")}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
  `;
};
