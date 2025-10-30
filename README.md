# BearLingo 🐻✨

### Project Description:
**BearLingo** is a gamified web platform designed to make job hunting engaging, structured, and stress-free for university students and recent graduates. Using principles from behavioral design and habit formation, BearLingo breaks career preparation into bite-sized lessons and interactive tasks, turning overwhelming job search challenges into achievable daily goals. Users track progress, earn badges, and stay motivated with streaks, leaderboards, and a career journal, building confidence and consistency along the way.
[Add a link to the final report]

### Key features:
- **Gamified Career Pathways:** CV Builder, Interview Skills Tower, Networking Hub, and a Holistic Career Pathway combining all three.
- **Progress Tracking:** Streaks, achievements, and a personal career journal to maintain motivation.
- **Leaderboard & Rewards:** Friendly competition encourages engagement and celebrates milestones.
- **Responsive & Interactive UI:** Animated transitions, streak counters, and progress bars make learning fun.
- **Secure Authentication:** JWT and bcrypt.js for safe login and data management.
- **Future-ready:** Planned AI-guided journal, mobile app version, and multi-platform support.

### Team members:
| Name          | Role          | 
| ------------- | ------------- | 
| Deiza | Team Lead / Frontend developer | 
| Labiqa | Designer / Frontend developer | 
| Ha | Designer / Frontend developer | 
| Venus | Full-stack developer | 
| Thamasha | Full-stack developer | 

#### 🚀 Deployed Website
You can access the live website here: [https://bearlingo-theta.vercel.app/](https://bearlingo-theta.vercel.app/)
 

---

### Tools & Technologies

Our project is built using a **modern web application stack** designed for performance, scalability, and an engaging gamified user experience. It supports **user tracking**, **responsive design**, and **interactive learning features**.

#### Languages
- **JavaScript (ES6+)** – Used for both frontend and backend development  
- **HTML5 & CSS3** – For building and styling the user interface  



#### Design & Prototyping
- **Figma** – Used to design gamified, cartoon-style interfaces, create interactive prototypes, and collaborate on visual layouts.  
- **Canva** – For creating simple yet effective visual assets such as logos, icons, banners, and achievement badges.  



#### Frontend Technologies

##### ⚡ Framework / Build Tool
- **Vite** `^7.1.2` – Fast and lightweight development environment for modern web apps  

##### ⚛️ Frontend Library
- **React.js** `^19.1.1` – Component-based library for building modular, dynamic UI elements (e.g., progress bars, leaderboards, goal trackers)

##### 🎨 Styling
- **Tailwind CSS** `^3.4.17` – Utility-first CSS framework for rapid, responsive design  
- **DaisyUI** `^4.12.24` – Tailwind CSS component library  
- **Flowbite React** `^0.12.9` – Prebuilt Tailwind-based components  
- **Tailwind Scrollbar** `^1.3.1` – Custom scrollbar styling  

##### ✨ Animation & UI Enhancements
- **Framer Motion** – For smooth, engaging animations and transitions  
- **@lottiefiles/dotlottie-react** `^0.17.4` – Lightweight animated illustrations (e.g., confetti effects for achievements)  
- **GSAP** `^3.13.0` – Advanced timeline-based animations  
- **Lucide React** `^0.542.0` – Icon library  
- **React Hot Toast** `^2.6.0` – Toast notifications  
- **React Draggable** `^4.5.0` – Draggable UI components  

##### 🔁 State Management
- **Zustand** `^5.0.8` – Lightweight global state management  

##### 🧭 Routing
- **React Router DOM** `^7.8.2` – Client-side routing  

##### 🌐 Networking
- **Axios** `^1.11.0` – HTTP requests between frontend and backend  

##### ⚙️ Development Tools
- **ESLint** `^9.33.0` – Linting and code quality  
- **Prettier** – Code formatting  
- **PostCSS** `^8.5.6` – CSS transformations  



#### Backend Technologies

##### 🧩 Runtime & Framework
- **Node.js** – JavaScript runtime for scalable backend development  
- **Express.js** `^5.1.0` – Web framework to manage API routes, authentication, and server-side logic  

##### 🗄️ Database & ORM
- **MongoDB** – NoSQL database for flexible, scalable data storage (user profiles, progress, leaderboards)  
- **Mongoose** `^8.17.2` – ODM library to model and manage MongoDB data  

##### 🔐 Authentication & Security
- **jsonwebtoken** `^9.0.2` – Token-based authentication  
- **bcryptjs** `^3.0.2` – Password hashing  
- **passport** `^0.7.0` & **passport-google-oauth20** `^2.0.0` – Google OAuth login  
- **cors** `^2.8.5` – Cross-origin request handling  
- **express-rate-limit** `^8.1.0` – Prevents excessive API calls  
- **cookie-parser** `^1.4.7` – Parses cookies for session handling  

##### 📂 File Handling & Parsing
- **multer** `^2.0.2` – File uploads  
- **pdf-parse** `^1.1.1`, **pdfkit** `^0.17.2` – PDF processing and generation  

##### ☁️ Cloud & AI Integration
- **openai** `^5.23.1` – AI-powered features and content generation  
- **@xenova/transformers** `^2.17.2` – Local AI model inference  

##### 🧰 Utilities & Logging
- **dotenv** `^17.2.1` – Environment variable management  
- **uuid** `^13.0.0` – Unique ID generation  
- **morgan** `^1.10.0` – HTTP request logging  

##### 🧑‍💻 Development Tools
- **nodemon** `^3.1.10` – Automatically restarts the server on file changes  
- **prettier** `^3.6.2` – Consistent code formatting  



*This combination of technologies ensures the project is efficient, visually engaging, and scalable — ideal for a gamified learning experience.*

---

#### Project management tool (Jira):
https://bearlingo-399.atlassian.net/jira/software/projects/SCRUM/boards/1?atlOrigin=eyJpIjoiZWMyZGRhZTBkYjk4NDU5YmE0Mjg2NTlkNzczNzY5YzIiLCJwIjoiaiJ9


---

### Installation & Setup Instructions

Follow the steps below to install and run the project locally.

#### 🧩 Prerequisites

Ensure the following are installed on your system:

- **Node.js** (v18 or higher)  
- **npm** (comes with Node.js)  
- **MongoDB** (local installation or MongoDB Atlas)  
- **Git** *(optional but recommended)*

#### Step 1: Clone the Repository

```bash
git clone https://github.com/uoa-compsci399-s2-2025/capstone-project-s2-2025-team-37.git
cd <project_folder>
```

#### Step 2: Setup the Backend
```bash
cd backend
```
**Install backend dependencies:**
```bash
npm install
```

- This will install all required dependencies, including:
express, mongoose, jsonwebtoken, bcryptjs, cors, dotenv, and more. 
- Development tools such as nodemon and prettier

**Create a `.env` file in the `/backend` directory:**
```bash
PORT=your-port-number
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/BearLingoDB>
JWT_SECRET=your-jwt-secret
NODE_ENV=development
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=your-redirect-uri
CLIENT_URL=http://localhost:5173
OPENAI_KEY=your-openai-key
```

**Initialize the database:**
```bash
npm run init-db
```

**Run the backend server:**
```bash
npm run dev
```

Backend will start on: http://localhost:3000 or `http://localhost:<PORT>`

#### Step 3: Setup the Frontend
```bash
cd frontend
```

**Install frontend dependencies:**
```bash
npm install
```

This installs:
- React, Vite, and React Router DOM
- Tailwind CSS, DaisyUI, Flowbite React
- Zustand, Axios, and UI animation libraries

**Run the frontend development server:**
```bash
npm run dev
```
Frontend will start on: http://localhost:5173


#### Step 4: Connect Frontend & Backend
- Ensure both servers are running:
   - Frontend → http://localhost:5173
   - Backend → http://localhost:5000
- API requests from the frontend (via Axios) should target the backend URL.
- Adjust API base URLs in the frontend code if necessary.

---

### 🔮 Future Plan

Here are some ideas and directions for future releases of the app:

- **Enhanced Subtasks**  
  - Make subtasks more useful and less work for users.  
  - Example: In the CV module, after a user uploads a CV, provide advanced analysis including spelling and grammar checks.  

- **Gamification Improvements**  
  - Add mini-games that users can play between tasks to earn points.  
  - Users can spend points to **decorate their room/department**, making the app feel like a game rather than a stressful career journey.  
  - Include **escape-room style challenges** for added engagement.  
  - Add animated characters (e.g., a talking bear moving around the room) to make the interface more engaging.

- **AI Integration for Task Assistance**  
  - Automatically provide company details when users search for a company instead of filling forms manually.  
  - Reduce repetitive tasks and increase helpful guidance.

- **Responsive Design**  
  - Ensure the app looks great on all screen sizes (desktop, tablet, mobile).

- **Additional Visual & Interactive Elements**  
  - Add animations for feedback and achievements (e.g., confetti, streak counters, animated badges).  
  - Show illustrative examples of game-like UI for inspiration.

---

### 🎓 Acknowledgements

We would like to thank the following resources and people for their guidance and tutorials:

#### 📚 Tutorials & Guides:
- **GSAP Cheatsheet** – [https://gsap.com/cheatsheet](https://gsap.com/cheatsheet)  
- **Animations with GSAP** – [YouTube Tutorial 1](https://www.youtube.com/watch?v=F9gB5b4jgOI&t=376s), [YouTube Tutorial 2](https://www.youtube.com/watch?v=c2M-rlkkT5o)  
- **Node.js Getting Started** – [https://www.w3schools.com/nodejs/nodejs_get_started.asp](https://www.w3schools.com/nodejs/nodejs_get_started.asp)  
- **Express.js Setup** – [https://expressjs.com/en/starter/installing.html](https://expressjs.com/en/starter/installing.html)  
- **Mongoose & MongoDB Docs** – [Mongoose](https://www.mongodb.com/docs/drivers/node/current/integrations/mongoose-get-started/), [CRUD](https://www.mongodb.com/docs/manual/crud/?utm_source=Iterable&utm_medium=email&utm_campaign=campaign_7716150)  
- **Tailwind CSS Documentation** – [Tailwind v2 Docs](https://v2.tailwindcss.com/docs), [Margin Utilities](https://tailwindcss.com/docs/margin)  
- **DaisyUI Documentation** – [https://daisyui.com/docs/themes/](https://daisyui.com/docs/themes/)  
- **React Hot Toast** – [https://react-hot-toast.com/](https://react-hot-toast.com/)  
- **Email & Password Validator (Frontend)** – [DaisyUI Validator Component](https://daisyui.com/components/validator/)

#### 💻 Projects Referred:
- **WDCC Node.js + Express.js Workshop** – [GitHub Repo](https://github.com/UoaWDCC/workshop-js-node-apis-2025)  
- **WDCC MongoDB Workshop Starter** – [GitHub Repo](https://github.com/UoaWDCC/mongo-workshop-starter-2025)

#### 👥 People Consulted:
- **Tutor:** Brenda San Germán  
  - Email: bsan361@auckland.ac.nz


