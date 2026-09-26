# Armin Admin

Armin Admin is the administrative interface of the Armin Template ecosystem.

It is a separate React application used by administrators to manage the application through the Armin API.

## Role in the Armin Ecosystem

Armin consists of three independent applications:

* **Armin API** — Laravel backend and source of truth for business rules, authorization, data, orders, payments, and subscriptions.
* **Armin Admin** — React-based administrative interface for management workflows.
* **Armin Web** — Next.js public-facing web application.

The Admin application does not contain authoritative business rules. It consumes the API and provides the administrative user interface.

## Tech Stack

* React 19
* TypeScript
* Vite 8
* Tailwind CSS 4
* React Router
* Axios
* i18next / react-i18next
* Lucide React
* SweetAlert2

## Requirements

* Node.js
* npm
* A running Armin API instance

## Environment

Create a local environment file:

```bash
cp .env.example .env.local
```

The default development configuration is:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Set `VITE_API_BASE_URL` to the base URL of the Armin API used by the Admin application.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will display the local URL in the terminal.

## Validation

Run the production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Repository Structure

The application source code is located in:

```text
src/
```

The Admin application is intentionally maintained as an independent frontend repository. It does not depend on the implementation details of the Web application.

## Relationship to the API

The Armin API is the authoritative backend.

The Admin application is responsible for:

* Administrative navigation
* Tables and data presentation
* Forms and filters
* Pagination
* Administrative workflows
* Feedback and UI state
* Localization and RTL/LTR presentation
* Responsive administrative UX

Business rules and authorization remain enforced by the API.

## Armin Template

Armin Admin is part of the reusable Armin Template ecosystem.

The central Armin Template documentation is maintained separately in the API repository. Product-specific work belongs to the product instance created from the Template.

For example:

```text
Armin Template
      ↓
Product Instance
      ↓
Armin Admin
      ↓
Product-specific administration
```

## Status

**Complete / Stable**

The current Admin application represents the stable administrative baseline of the Armin Template.
