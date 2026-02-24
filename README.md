# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Auth & API

- **LocalStorage:** وضعیت لاگین در `localStorage` (کلید `socially_user`) ذخیره می‌شود؛ با رفرش صفحه کاربر لاگ‌اوت نمی‌شود.
- **اتصال به بک‌اند:** برای لاگین و ثبت‌نام، فایل `.env` بسازید و آدرس API را تنظیم کنید:
  - کپی از `.env.example` به `.env`
  - مقدار `VITE_API_URL` را برابر آدرس بک‌اند بگذارید (مثلاً `http://localhost:3000`). انتظار می‌رود بک‌اند این endpointها را داشته باشد:
    - `POST /auth/login` با body `{ "email", "password" }` و پاسخ `{ "user": { "id?", "email", "name?", "token?" }, "token?" }`
    - `POST /auth/register` با body `{ "name", "email", "password" }` و همان فرمت پاسخ.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
