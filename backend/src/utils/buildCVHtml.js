// Converting a CV document into HTML
export const buildCVHtml = (cv) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${cv.firstName} ${cv.lastName} - CV</title>
      <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #030213;
            --primary-foreground: #ffffff;
            --secondary: #f1f5f9;
            --secondary-foreground: #030213;
            --muted: #ececf0;
            --muted-foreground: #717182;
            --foreground: #030213;
            --background: #ffffff;
            --card: #ffffff;
            --border: rgba(0, 0, 0, 0.1);
            --radius: 0.625rem;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f9fafb;
            color: var(--foreground);
            line-height: 1.5;
            padding: 2rem 1rem;
        }

        .container {
            max-width: 64rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .card {
            background-color: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .card-padding {
            padding: 1.5rem;
        }

        .card-padding-lg {
            padding: 2rem;
        }

        .text-center {
            text-align: center;
        }

        .space-y-4 > * + * {
            margin-top: 1rem;
        }

        .space-y-6 > * + * {
            margin-top: 1.5rem;
        }

        .space-y-2 > * + * {
            margin-top: 0.5rem;
        }

        .space-y-1 > * + * {
            margin-top: 0.25rem;
        }

        .flex {
            display: flex;
        }

        .items-center {
            align-items: center;
        }

        .items-start {
            align-items: flex-start;
        }

        .justify-center {
            justify-content: center;
        }

        .justify-between {
            justify-content: space-between;
        }

        .gap-2 {
            gap: 0.5rem;
        }

        .gap-4 {
            gap: 1rem;
        }

        .gap-6 {
            gap: 1.5rem;
        }

        .flex-wrap {
            flex-wrap: wrap;
        }

        .h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }

        .h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 1rem;
        }

        .h3 {
            font-size: 1.125rem;
            font-weight: 600;
        }

        .subtitle {
            font-size: 1.25rem;
            color: var(--muted-foreground);
        }

        .text-sm {
            font-size: 0.875rem;
        }

        .text-primary {
            color: var(--primary);
        }

        .text-muted {
            color: var(--muted-foreground);
        }

        .font-medium {
            font-weight: 500;
        }

        .font-semibold {
            font-weight: 600;
        }

        .leading-relaxed {
            line-height: 1.625;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            border-radius: calc(var(--radius) - 2px);
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 600;
            background-color: var(--secondary);
            color: var(--secondary-foreground);
        }

        .date-badge {
            background-color: var(--muted);
            color: var(--muted-foreground);
            padding: 0.25rem 0.5rem;
            border-radius: calc(var(--radius) - 2px);
            font-size: 0.75rem;
            white-space: nowrap;
        }

        .separator {
            height: 1px;
            background-color: var(--border);
            margin: 1rem 0;
        }

        .mb-2 {
            margin-bottom: 0.5rem;
        }

        .mb-3 {
            margin-bottom: 0.75rem;
        }

        .mb-4 {
            margin-bottom: 1rem;
        }

        .mb-6 {
            margin-bottom: 1.5rem;
        }

        .mt-4 {
            margin-top: 1rem;
        }

        .grid {
            display: grid;
        }

        .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .contact-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.875rem;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .icon {
            width: 1rem;
            height: 1rem;
            color: var(--muted-foreground);
        }

        .project-link {
            color: var(--primary);
            text-decoration: none;
            margin-left: 0.5rem;
        }

        .project-link:hover {
            opacity: 0.8;
        }

        .list-item {
            margin-left: 1rem;
        }

        @media (min-width: 640px) {
            .contact-info {
                flex-direction: row;
                justify-content: center;
                gap: 1.5rem;
            }
        }

        @media (max-width: 768px) {
            .h1 {
                font-size: 1.875rem;
            }
            
            .grid-cols-2 {
                grid-template-columns: 1fr;
            }
            
            .flex-between-mobile {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
        }

        @media (min-width: 768px) {
            .flex-between-mobile {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
            }
        }
    </style>
  </head>
  <body>
      <div class="container">
          <!-- Header Section -->
          <div class="card card-padding-lg">
              <div class="text-center space-y-4">
                  <div>
                      <h1 class="h1">${cv.firstName} ${cv.lastName}</h1>
                      <p class="subtitle">Software Engineer</p>
                  </div>
                  
                  <div class="contact-info">
                      <div class="contact-item">
                          <span>${cv.contact.email}</span>
                      </div>
                      <div class="contact-item">
                          <span>${cv.contact.phone}</span>
                      </div>
                      <div class="contact-item">
                          <span>${cv.contact.linkedin || ""}</span>
                      </div>
                  </div>
              </div>
          </div>

          <!-- About Me Section -->
          <div class="card card-padding">
              <h2 class="h2">About Me</h2>
              <p class="text-muted leading-relaxed">${cv.aboutMe}</p>
          </div>

          <!-- Skills Section -->
          <div class="card card-padding">
              <h2 class="h2">Skills</h2>
              <div class="flex flex-wrap gap-2">
                  ${cv.skills.map((skill) => `<span class="badge">${skill}</span>`).join("")}
              </div>
          </div>

          <!-- Experience Section -->
          <div class="card card-padding">
              <h2 class="h2">Work Experience</h2>
              <div class="space-y-6">
                  ${cv.experiences
                    .map(
                      (exp) => `
                      <div>
                          <div class="flex-between-mobile mb-2">
                              <div>
                                  <h3 class="h3">${exp.role}</h3>
                                  <p class="text-primary font-medium">${exp.company}</p>
                              </div>
                              <span class="date-badge">${exp.startYear} - ${exp.endYear}</span>
                          </div>
                          <p class="text-muted leading-relaxed">${exp.contribution}</p>
                      </div>
                      <div class="separator"></div>
                  `
                    )
                    .join("")}
              </div>
          </div>

          <!-- Projects Section -->
          <div class="card card-padding">
              <h2 class="h2">Projects</h2>
              <div class="space-y-6">
                  ${cv.projects
                    .map(
                      (p) => `
                      <div>
                          <div class="flex items-center gap-2 mb-2">
                              <h3 class="h3">${p.name}</h3>
                              ${p.link ? `<a href="${p.link}" class="project-link" target="_blank">🔗</a>` : ""}
                          </div>
                          <div class="space-y-2 text-sm">
                              <p class="text-muted"><span class="font-medium">Outcome:</span> ${p.outcome}</p>
                              <p class="text-muted"><span class="font-medium">My Role:</span> ${p.roleContribution}</p>
                          </div>
                      </div>
                      <div class="separator"></div>
                  `
                    )
                    .join("")}
              </div>
          </div>

          <!-- Education Section -->
          <div class="card card-padding">
              <h2 class="h2">Education</h2>

              <!-- Tertiary -->
              <div class="space-y-4 mb-6">
                  <h3 class="h3">Higher Education</h3>
                  ${cv.education.tertiary
                    .map(
                      (ed) => `
                      <div class="flex-between-mobile">
                          <div>
                              <p class="font-medium">${ed.degree}</p>
                              <p class="text-muted">${ed.university}</p>
                          </div>
                          <span class="date-badge">${ed.startYear} - ${ed.endYear}</span>
                      </div>
                  `
                    )
                    .join("")}
              </div>

              <div class="separator"></div>

              <!-- Secondary -->
              <div>
                  <h3 class="h3 mb-4">Secondary Education</h3>
                  <div class="flex-between-mobile mb-3">
                      <div><p class="font-medium">${cv.education.secondary.schoolName}</p></div>
                      <span class="date-badge">${cv.education.secondary.startYear} - ${cv.education.secondary.endYear}</span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                          <p class="font-medium mb-2">Key Subjects:</p>
                          <div class="text-muted space-y-1">
                              ${cv.education.secondary.subjects.map((s) => `<div>• ${s}</div>`).join("")}
                          </div>
                      </div>
                      <div>
                          <p class="font-medium mb-2">Achievements:</p>
                          <div class="text-muted space-y-1">
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
