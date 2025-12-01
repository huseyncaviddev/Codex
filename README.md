# EPC EDMS Platform

## Understanding & Architecture
This project is a production-style electronic document management system (EDMS) for EPC/construction projects. It supports multi-organization collaboration, document control, workflows, and transmittals similar to Aconex.

**High-level architecture**
- **Frontend**: Next.js App Router with Tailwind + shadcn-compatible styling, React Query for data fetching, React Hook Form + Zod for validation, and Zustand/contexts for UI state. Pages include document register, transmittals, workflows, and admin.
- **Backend**: NestJS with Prisma ORM and PostgreSQL. JWT authentication with RBAC guards, REST endpoints organized by bounded contexts (auth, organizations, projects, documents, transmittals, workflows, audit, files). File storage is abstracted via an interface with local and S3-style implementations.
- **Infrastructure**: Docker Compose spins up PostgreSQL, API, and frontend. Prisma schema models organizations, users, projects, documents/revisions, transmittals, workflows, and audit logs.

**Data model (ERD-style)**
- **Organization** ⇄ **User** (users belong to exactly one organization).
- **Project** links multiple organizations (**ProjectOrganization**) and users (**ProjectParticipant**).
- **Document** belongs to a project and owning organization, with unique document numbers per org/project. **DocumentRevision** tracks file references, issue history, and supersedence.
- **FileObject** stores metadata for uploaded files; linked to revisions and standalone attachments.
- **Transmittal** represents project mail with to/cc orgs, linked revisions, attachments, and threaded **TransmittalMessage** replies.
- **Workflow** ties to a document revision, with ordered **WorkflowStep** items capturing role, organization, decision, and timestamps.
- **AuditLog** records critical actions with actor, entity, and metadata for traceability.

## Running locally (Docker)
```bash
docker-compose up --build
```
- API: http://localhost:3001/api
- Frontend: http://localhost:3000
- Database: postgres://edms:edms@localhost:5432/edms

For local development without containers:
```bash
cd backend && npm install && npm run prisma:generate && npm run start:dev
cd frontend && npm install && npm run dev
```

## Key API endpoints (REST)
- `POST /api/auth/register` — create a user within an organization.
- `POST /api/auth/login` — returns JWT access/refresh tokens.
- `GET /api/projects/me` — projects for current user.
- `POST /api/documents` — create document (ORG_ADMIN/DCC only).
- `POST /api/documents/:id/revisions` — upload revision and supersede prior current.
- `GET /api/transmittals?projectId=` — list transmittals relevant to the caller’s org.
- `PATCH /api/workflows/:id/steps/:stepIndex` — complete a workflow step with a decision.
- `GET /api/audit?projectId=` — audit trail filter by project.
- `GET /api/files/presign-upload` / `presign-download` — obtain pre-signed URLs.

## Testing
Jest is configured for the backend with unit-test focus on domain flows (superseding revisions, workflow transitions, RBAC checks). Run with:
```bash
cd backend && npm test
```

## Notes & Assumptions
- JWT secret and S3 credentials are provided via environment variables; default dev values are included for local runs.
- File upload/download relies on pre-signed URL generation; replace stub implementations with real S3 or on-prem object storage provider for production.
- Seed data should be added under `backend/prisma/seed.ts` (placeholder) to create demo organizations, users, projects, documents, and transmittals.
