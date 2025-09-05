// Converting a CV document into HTML
export const buildCVHtml = (cv) => {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${cv.firstName} ${cv.lastName} - CV</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: Calibri, sans-serif;
        background-color: white;
        color: #1f2937;
        line-height: 1.6;
        min-height: 100vh;
      }
      .container { max-width: 56rem; margin: 0 auto; padding: 1.5rem 1rem; }
      .header { margin-bottom: 1.5rem; }
      .name {
        font-family: "Trebuchet MS","Lucida Sans Unicode","Lucida Grande","Lucida Sans",Arial,sans-serif;
        font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem; color: black;
      }
      .contact-info { display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; color: #4b5563; }
      .contact-item { display: flex; align-items: center; gap: 0.5rem; }
      .contact-item svg { width: 1rem; height: 1rem; color: #3b82f6; flex-shrink: 0; }
      .contact-item a { color: #4b5563; text-decoration: none; word-break: break-all; transition: color 0.2s; }
      .contact-item a:hover { color: #3b82f6; }
      .section { margin-bottom: 1.5rem; }
      .section-title {
        font-family: "Trebuchet MS","Lucida Sans Unicode","Lucida Grande","Lucida Sans",Arial,sans-serif;
        font-size: 1.125rem; font-weight: bold; color: black;
        border-bottom: 2px solid #333333; padding-bottom: 0.25rem; margin-bottom: 0.75rem;
      }
      .section-content { font-size: 0.875rem; color: #1f2937; line-height: 1.625; }
      .skills-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .skill-tag {
        background-color: #eff6ff; color: #3b82f6; border: 1px solid #3b82f6;
        padding: 0.25rem 0.5rem; border-radius: 0.9rem; font-size: 0.875rem;
      }
      .experience-container,.projects-container,.education-container { display: flex; flex-direction: column; gap: 1rem; }
      .experience-item,.project-item,.education-item { display: flex; flex-direction: column; gap: 0.5rem; }
      .item-separator { border-top: 1px solid #e5e7eb; padding-top: 1rem; }
      .item-title { font-size: 1rem; font-weight: 600; color: #1f2937; }
      .item-subtitle { font-size: 0.875rem; color: #4b5563; }
      .company-name,.education-degree { font-weight: bold; color: #3b82f6; }
      .item-description { font-size: 0.875rem; color: #1f2937; line-height: 1.625; }
      .project-link { color: #4b5563; text-decoration: underline; word-break: break-all; margin-left: 0.25rem; transition: color 0.2s; }
      .project-link:hover { color: #3b82f6; }
      @media (min-width: 640px) {
        .container { padding: 2rem 1.5rem; }
        .header { margin-bottom: 2rem; }
        .name { font-size: 2.25rem; }
        .contact-info { flex-direction: row; flex-wrap: wrap; gap: 1rem; font-size: 1rem; }
        .section { margin-bottom: 2rem; }
        .section-title { font-size: 1.25rem; margin-bottom: 1rem; }
        .section-content { font-size: 1rem; }
        .skills-container { gap: 0.75rem; }
        .skill-tag { padding: 0.5rem 0.75rem; font-size: 1rem; }
        .experience-container,.projects-container,.education-container { gap: 1.5rem; }
        .item-separator { padding-top: 1.5rem; }
        .item-title { font-size: 1.125rem; }
        .item-subtitle { font-size: 1rem; }
        .item-description { font-size: 1rem; }
        .project-link { font-size: 1rem; }
      }
      @media (min-width: 1024px) {
        .container { padding: 3rem 2rem; }
        .name { font-size: 3rem; }
        .contact-info { gap: 1.5rem; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1 class="name">${cv.firstName} ${cv.lastName}</h1>
        <div class="contact-info">
          ${cv.contact.phone ? `
          <div class="contact-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span>${cv.contact.phone}</span>
          </div>` : ""}
          ${cv.contact.email ? `
          <div class="contact-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>${cv.contact.email}</span>
          </div>` : ""}
          ${cv.contact.linkedin ? `
          <div class="contact-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            <a href="${cv.contact.linkedin}">${cv.contact.linkedin}</a>
          </div>` : ""}
        </div>
      </div>

      <!-- About Me -->
      ${cv.aboutMe ? `
      <section class="section">
        <h2 class="section-title">OBJECTIVES</h2>
        <p class="section-content">${cv.aboutMe}</p>
      </section>` : ""}

      <!-- Skills -->
      ${cv.skills?.length ? `
      <section class="section">
        <h2 class="section-title">SKILLS</h2>
        <div class="skills-container">
          ${cv.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}
        </div>
      </section>` : ""}

      <!-- Work Experience -->
      ${cv.experiences?.length ? `
      <section class="section">
        <h2 class="section-title">WORK EXPERIENCE</h2>
        <div class="experience-container">
          ${cv.experiences.map((exp, idx) => `
            <div class="experience-item ${idx > 0 ? "item-separator" : ""}">
              <h3 class="item-title">${exp.role}</h3>
              <div class="item-subtitle">
                <span class="company-name">${exp.company}</span> | ${exp.startYear} - ${exp.endYear}
              </div>
              <p class="item-description">• ${exp.contribution}</p>
            </div>`).join("")}
        </div>
      </section>` : ""}

      <!-- Projects -->
      ${cv.projects?.length ? `
      <section class="section">
        <h2 class="section-title">PROJECTS</h2>
        <div class="projects-container">
          ${cv.projects.map((p, idx) => `
            <div class="project-item ${idx > 0 ? "item-separator" : ""}">
              <div class="item-title">
                ${p.name}${p.link ? ` - <a href="${p.link}" class="project-link">[${p.link}]</a>` : ""}
              </div>
              <p class="item-description">${p.outcome}</p>
              <p class="item-description">• ${p.roleContribution}</p>
            </div>`).join("")}
        </div>
      </section>` : ""}

      <!-- Education -->
      <section class="section">
        <h2 class="section-title">EDUCATION</h2>
        <div class="education-container">
          ${cv.education.tertiary.map((ed, idx) => `
            <div class="education-item ${idx > 0 ? "item-separator" : ""}">
              <h3 class="item-title">${ed.university}</h3>
              <div class="item-subtitle">
                <span class="education-degree">${ed.degree}</span> | ${ed.startYear} - ${ed.endYear}
              </div>
            </div>`).join("")}

          <div class="education-item item-separator">
            <h3 class="item-title">${cv.education.secondary.schoolName}</h3>
            <div class="item-subtitle">
              <span class="education-degree">${cv.education.secondary.subjects.join(", ")}</span> | ${cv.education.secondary.startYear} - ${cv.education.secondary.endYear}
            </div>
            ${cv.education.secondary.achievements?.length ? `
            <p class="item-description"><strong>Achievements:</strong> ${cv.education.secondary.achievements.join(", ")}</p>` : ""}
          </div>
        </div>
      </section>
    </div>
  </body>
</html>
  `;
};
