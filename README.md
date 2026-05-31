# ⏳ TimeFlow 

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![H2 Database](https://img.shields.io/badge/Database-H2%20In--Memory-4479A1?style=for-the-badge&logo=database&logoColor=white)

**TimeFlow** is a modern, full-stack activity and attendance tracking application. Designed with a sleek glassmorphism UI, it allows teams to seamlessly log work hours, request vacations, track holidays, and export analytical data with a single click.

---

## ✨ Key Features

*   **🛡️ Role-Based Access Control (RBAC):** Distinct environments for standard Users and Administrators.
*   **📊 Comprehensive Admin Dashboard:** Admins can view all user activities and perform global CSV data exports.
*   **📥 Real-Time CSV Exports:** One-click data generation for "All Time" or specific date ranges.
*   **🌍 Multi-Language Support:** Fully localized in English, Russian, and Czech (`i18next`).
*   **🎨 Glassmorphism UI:** A custom, lightweight frontend built without heavy CSS frameworks, featuring dynamic light/dark modes.
*   **🚀 Zero-Config Startup:** Auto-seeding in-memory database allows the app to be fully functional within seconds of cloning.

---

## 🛠️ Tech Stack

### Frontend (`/Front`)
*   **React 18** (bootstrapped with **Vite** for blazing fast HMR)
*   **React Router v6** for seamless SPA navigation
*   **i18next** for internationalization
*   **Axios** for API communication
*   **Pure CSS** leveraging CSS variables for dynamic theming

### Backend (`/Back`)
*   **Java 21** & **Spring Boot 3**
*   **Spring Security** (JWT/Session based authentication)
*   **Spring Data JPA** & **Hibernate**
*   **H2 Database** (In-memory, automatically recreated on startup)
*   **OpenAPI/Swagger** (Available for API documentation)

---

## 🚀 Quick Start (One-Command Run)

This project is built as a monorepo. You don't need to install databases or configure complex environments. Just clone and run.

### 1. Clone the repository
```bash
git clone [https://github.com/alienbed123456789-jpg/dev.git](https://github.com/alienbed123456789-jpg/dev.git)
cd dev
2. Run the applicationFor Windows:Double-click the start.bat file in the root directory.For macOS / Linux:Open your terminal and execute:Bashchmod +x start.sh
./start.sh
3. Open in BrowserWeb UI: http://localhost:5173Backend API: http://localhost:8080👥 Seeded Test DataTo make testing effortless, the DataSeeder automatically populates the database on startup. You do not need to register a new account.Use the following pre-configured credentials to explore the app:RoleEmailPasswordDetailsADMINadmin@timeflow.comadmin123Full access to the Admin Panel and global database CSV exports.USERjohn@timeflow.comuser123Standard employee account. Pre-filled with realistic work data for the previous month.USERjane@timeflow.comuser123Standard employee account. Pre-filled with realistic work data for the previous month.🔒 Security & EnvironmentNo Hardcoded Secrets: All sensitive credentials (such as Google OAuth Client IDs and Mail server passwords) are kept out of version control.Environment Variables: A .env.example file is provided in the root directory. In a production environment, you would rename this to .env and provide real credentials.Data Reset: Because the application utilizes an H2 In-Memory database (spring.jpa.hibernate.ddl-auto=create-drop), all data is completely wiped and re-seeded cleanly every time the backend restarts.🏗️ Architecture NotesThis project embraces a lightweight approach. Instead of relying on heavy component libraries (like Material UI or Tailwind), the frontend relies on raw CSS to maintain absolute control over the frosted-glass aesthetic. The backend is designed with domain-driven principles, keeping TimeEntry, Attendance, and User entities strictly decoupled yet easily queried via Spring Data JPA.

## ⏱️ Effort Estimation
This section provides a rough breakdown of the time invested in developing the core components of the project. These estimates reflect the effort to build a maintainable, full-stack application from scratch.

| Phase | Time Spent |
| :--- | :--- |
| **DB & Schema Design** | 2h |
| **API & Auth (Security/OAuth2)** | 6h |
| **Frontend Development** | 8h |
| **Packaging & Documentation** | 1.5h |
| **Testing & Bug Fixing** | 2h |
| **Total** | **19.5h** |
