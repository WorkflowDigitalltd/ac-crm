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
- `troubleshoot-docker.bat` - **NEW!** Interactive troubleshooting menu for Docker issues

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

## Docker Troubleshooting

### **Quick Fix: Run the Troubleshooting Script**
```bash
# Interactive troubleshooting menu
./troubleshoot-docker.bat
```

### **Problem: Changes Not Showing Up**

If you make code changes but they don't appear in the browser, follow this troubleshooting guide:

#### **Step 1: Try Simple Restart First (90% of cases)**
```bash
# Restart specific service
docker-compose restart frontend
# OR restart all services
./restart-all.bat
```

#### **Step 2: If Changes Still Don't Show - Docker Cache Issue**
This is what we experienced - Docker was using cached layers and not picking up changes.

**For Frontend Issues:**
```bash
# Complete frontend rebuild (no cache)
docker-compose stop frontend
docker-compose rm -f frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

**For Backend Issues:**
```bash
# Complete backend rebuild (no cache)
docker-compose stop backend
docker-compose rm -f backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

**For All Services:**
```bash
# Nuclear option - rebuild everything
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### **Step 3: Browser Cache Issues**
- Try hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- Open browser developer tools and disable cache
- Try incognito/private browsing mode

#### **When to Use Each Approach**
| Issue | Solution | When to Use |
|-------|----------|-------------|
| Code changes not showing | `docker-compose restart <service>` | **Always try first** |
| Still not working | Rebuild with `--no-cache` | When restart doesn't work |
| Browser shows old version | Hard refresh `Ctrl+F5` | After container changes |
| Nothing works | Nuclear rebuild all | Last resort |

### **Key Lesson: Docker Build Cache**
- Docker aggressively caches build layers for speed
- Sometimes it doesn't detect code changes as requiring a rebuild
- The `--no-cache` flag forces Docker to rebuild everything from scratch
- This is why our delete button wasn't showing until we used `--no-cache`

## UK Settings
- Dates: DD-MM-YYYY
- Currency: £
- Spelling: UK English

## Docker Compose Restart Rule
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
