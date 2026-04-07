# Sub Scout - Project Memory & AI Rules

## Project Mission

Sub Scout is a web application that helps users track their paid subscriptions. It uses a Monthly Self-Assessment Rating (1-10) and calculates a "Value Score" (Rating/Monthly Cost ratio) to help users visualize which subscriptions provide the most value and which should be considered for cancellation.

## Tech Stack

- **Frontend:** React.js (via Vite), Tailwind CSS, Framer Motion, Lucide-React, Axios.
- **Backend:** Node.js, Express.js.
- **Database & Auth:** PostgreSQL via Supabase.

## AI Developer Rules (Skills & Behavior)

1. **Plan Mode First:** NEVER write code before presenting a step-by-step plan and asking for the user's approval.
2. **Token Efficiency:** Output ONLY the requested code. Do not output the entire file if you only made a small change. Use diffs or specify exactly where to insert.
3. **STRICT Modularity (MVC Architecture):** Separate concerns completely.
   - **Frontend:** Always inside `/client`.
   - **Backend:** Always inside `/server`.
   - **Routes (`/server/routes/`):** ONLY endpoint definitions (`router.get`, `router.post`). NO business logic, NO database queries.
   - **Controllers (`/server/controllers/`):** ONLY business logic and request/response handling (`req`, `res`). Call Model methods from here.
   - **Models (`/server/models/`):** ONLY database schemas, SQL queries, and DB connections. No request handling.
   - **Entry (`/server/index.js`):** ONLY server setup, middleware config, and route mounting.
   - **VIOLATION OF THIS RULE IS UNACCEPTABLE.**
4. **Professionalism:** Always use environment variables (`.env`) for secrets. Always include basic error handling (`try/catch`) in server routes.
5. **Memory Update:** Before finishing a major task, remind the user to update this
