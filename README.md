# Mini CRM

A simple CRM system for managing clients, products/services, and sales/orders.

## Getting Started (Development)

1. Copy `.env.example` to `.env` and adjust if needed.
2. Make sure you have Docker Desktop installed.
3. Run `docker-compose up --build` to start the development environment.
4. The backend (.NET) will be available at http://localhost:5000
5. The frontend (React) will be available at http://localhost:3000

## Development Workflow

Due to Docker volume mount issues on Windows, we use a restart-first, rebuild-when-needed workflow:

### **IMPORTANT: Always Try Restarting First!**

**Step 1: Try Restarting Services First**
- Run `restart-all.bat` to cleanly restart all containers
- This should be your **first choice** for applying changes
- Much faster than rebuilding and often sufficient

**Step 2: Only Rebuild When Restart Doesn't Work**
- If restarting doesn't show your changes, then rebuild
- For frontend changes: Run `rebuild-frontend.bat` (or `rebuild-frontend.ps1` for PowerShell)
- For backend changes: Run `docker-compose build backend && docker-compose up -d backend`

### When to Use Each Approach
- **Restart First**: Always try this first - it's faster and usually works
- **Rebuild Frontend**: Only when restart doesn't show frontend changes
- **Rebuild Backend**: Only when restart doesn't show backend changes or you've changed dependencies

### Available Scripts
- `restart-all.bat` - **USE THIS FIRST** - Restart all services cleanly
- `rebuild-frontend.bat` / `rebuild-frontend.ps1` - Rebuild frontend container only (when restart isn't enough)

### Workflow Summary
1. Make your code changes
2. Run `restart-all.bat` first
3. Check if changes are visible
4. Only if changes aren't visible, then rebuild the specific service

## Project Structure
- `/backend` - .NET Core API
- `/frontend` - React app
- `/db-data` - Postgres persistent data

---

**Stay in development mode until ready to go live.**

---

## UK Settings
- Dates: DD-MM-YYYY
- Currency: £
- Spelling: UK English


Docker Compose Restart Rule
Instruction:

Whenever a container needs to be restarted to apply changes (such as code updates, environment changes, or to resolve issues), always use:

pgsql
Copy
Edit
docker-compose restart <service-name>
where <service-name> is either frontend or backend (or another specific service).

Rules:

Do NOT use docker-compose down or docker-compose up to restart services except when absolutely necessary (e.g. you need to rebuild the image, update dependencies, or change the service definition).

ONLY use docker-compose build and then docker-compose up -d <service-name> if you have made changes to the Dockerfile or the dependencies, or if specifically instructed to do so.

For routine code changes, config tweaks, or general service restarts, always use docker-compose restart <service-name>.

Avoid using docker-compose up without -d to prevent accidental interactive/foreground runs unless specifically troubleshooting.

Summary:

Default: docker-compose restart <service-name>

Only rebuild: If Dockerfile/dependencies change, then docker-compose build <service-name> followed by docker-compose up -d <service-name>

Never use: docker-compose down or docker-compose up for normal restarts.

Example Scenarios:

Scenario	Correct Command(s)
Code/config updated	docker-compose restart backend
Dockerfile changed	docker-compose build backend
docker-compose up -d backend
Add new dependency	docker-compose build backend
docker-compose up -d backend
Quick restart after crash	docker-compose restart backend
Full rebuild required	Only if specifically needed, not by default
