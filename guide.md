# Mini CRM: Developer Guide

This guide will help you start, stop, and develop your Mini CRM project using Docker. It is written for someone new to Docker and web development, with clear step-by-step instructions.

---

## 1. Prerequisites
- **Docker Desktop** must be installed and running on your computer.
- Make sure you have the project folder (`ac-mini-crm`) on your computer.

---

## 2. Starting the Mini CRM for Development or Testing

### Step-by-Step Instructions

#### 1. Open Docker Desktop
- Launch Docker Desktop from your Start menu or desktop shortcut.
- Wait until Docker Desktop says it is running.

#### 2. Open a Terminal (Command Prompt or PowerShell)
- Press `Windows + R`, type `cmd` or `powershell`, and press Enter.
- Use `cd` to change to your project folder, e.g.:
  ```sh
  cd C:\Users\sposa\Desktop\Lee\ac-mini-crm
  ```

#### 3. Start All Services (Database, Backend, Frontend)
- Run this command to start everything:
  ```sh
  docker-compose up -d
  ```
- This will start the database, backend, and frontend containers in the background.

#### 4. Wait for Everything to Start
- It may take 1-2 minutes the first time.
- You can check if everything is running with:
  ```sh
  docker-compose ps
  ```
- You should see `ac-mini-crm-backend-1`, `ac-mini-crm-frontend-1`, and `ac-mini-crm-db-1` listed as running.

#### 5. Open the App in Your Browser
- Go to [http://127.0.0.1:3000](http://127.0.0.1:3000) (or [http://localhost:3000](http://localhost:3000))
- The Mini CRM UI should appear.

---

## 3. Stopping the Mini CRM
- To stop all services, run:
  ```sh
  docker-compose down
  ```
- This will stop and remove the containers, but your data is saved in a Docker volume.

---

## 4. Common Commands

| Purpose                  | Command                                |
|--------------------------|----------------------------------------|
| Start all services       | `docker-compose up -d`                 |
| Stop all services        | `docker-compose down`                  |
| View logs (frontend)     | `docker-compose logs frontend`         |
| View logs (backend)      | `docker-compose logs backend`          |
| View running containers  | `docker-compose ps`                    |
| Restart frontend only    | `docker-compose restart frontend`      |
| Restart backend only     | `docker-compose restart backend`       |

---

## 5. Tips
- If you make changes to the frontend or backend code, just refresh the browser. Docker will detect changes and reload the app.
- If things look stuck, try restarting the affected container:
  ```sh
  docker-compose restart frontend
  ```
- If you see errors, use the logs commands above to diagnose.

---

## 6. Troubleshooting
- **App not loading on localhost:3000?** Try [http://127.0.0.1:3000](http://127.0.0.1:3000)
- **Containers not starting?** Make sure Docker Desktop is running.
- **Long startup times?** The first start is always slower. Subsequent starts will be faster.

---

## 7. Where is my data?
- Your database data is stored in a Docker volume (`postgres-data`). Stopping the app does not delete your data.

---

## 8. Using Git & GitHub (Basic Commands)

These are the most common commands you'll use to save your work and upload it to GitHub:

| Purpose                       | Command Example                                 |
|-------------------------------|------------------------------------------------|
| Check current status          | `git status`                                    |
| See which files have changed  | `git status`                                    |
| Add all changes               | `git add .`                                     |
| Add a specific file           | `git add filename.js`                           |
| Commit with a message         | `git commit -m "Describe your changes"`         |
| Push changes to GitHub        | `git push`                                      |
| Pull latest changes from GitHub| `git pull`                                      |
| Show log                      | `git log --oneline`                             |

### Typical workflow:
1. Make your changes in the code.
2. Open Terminal or PowerShell in your project folder.
3. Run:
   ```sh
   git status
   git add .
   git commit -m "A short message about what you did"
   git push
   git log --oneline
   ```
4. Your changes are now saved and uploaded to GitHub!

> 💡 **Tip:** Always write a short, clear message in quotes after `-m` describing what you changed (e.g. `git commit -m "Add customer dashboard"`).

---

## 9. Need more help?
- Ask your developer or AI assistant for help with any errors or questions!

---

**Happy developing!**
