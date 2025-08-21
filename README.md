[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=19992657)

## Run and set up react app locally

1. Switch to develop branch using this command: `git checkout develop`
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

After step (4) a localhost link would be provided, just copy and paste it into your browser of choice and you will see the app up and running!

## 🚀 Daily Workflow & Git guide

This guide explains how we collaborate on this project using Git.  
Follow these steps to keep your local code up to date and avoid conflicts.

---

#### 🌱 Creating Your Own Branch (for new features)

Before start working on a new feature (_e.g., login page_), create your own branch **based on `develop`**:

```bash
git checkout develop     # switch to base branch
git pull                 # make sure develop is up to date on local repository
git checkout -b login-page
```

### 🛠 Starting Work Each Day

1. Check which branch you’re on: `git branch`

   - The active branch will be highlighted with \*

2. Switch to the develop branch (_if not already on it_): `git checkout develop`
3. Pull the latest changes from remote: `git pull`
4. Switch back to your feature branch: `git checkout your-branch-name`
5. (_Optional but recommended_) Merge latest develop into your branch: `git merge develop`

   - If no conflicts → merge succeeds automatically.
   - If conflicts appear → solve them, or ask a teammate for help.

6. Go to the frontend/backend directory: `cd frontend` or `cd backend`
7. Install frontend/backend dependencies (_only needed if package.json in frontend/backend directory changed_): `npm install`
8. Start the development server: `npm run dev`
9. Open the app in the browser:
   - Copy the `URL` shown in the terminal & Paste it into your browser.
10. To stop the server:
    - Press `Ctrl + C` in the terminal

#### 💾 After Making Changes

9. Stage your changes: `git add .`
10. Commit your changes with a message: `git commit -m "Your commit message here"`
11. Push changes to the remote repository: `git push`
    - **Note:** If you are pushing a branch for the first time, use: `git push -u origin your-branch-name`
12. Finally, create a `Pull Request (PR)` on GitHub
    - Go to the repo on GitHub → create a PR from your branch → into develop.
    - Wait for teammates to review your code.
      - If approved and no conflicts → merge the PR.
      - If there are conflicts → resolve them (_ask for help if unsure_).

**📌 Remember**:

- Always pull the latest develop branch using `git checkout develop` and `git pull` before starting work.
- Always work on your own branch, never directly on develop or main.
- Keep branches small and focused (_one feature at a time_).

#### Helpful Git Commands

- To get changes from develop branch into your branch (might be needed for testing purposes):
  ```bash
  git checkout your-branch-name
  git merge develop
  ```
  - If no conflicts, should be able to merge
  - Else, have to solve the conflicts before merging
- Check status of your changes: `git status`
- To see your past commits: `git log`
- To just check what’s new on remote repo without changing your code: `git fetch`

---
