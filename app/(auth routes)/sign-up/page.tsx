"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters",
      );
      return;
    }

    try {
      await register({ email, password }); // POST /api/auth/register
      router.push("/profile"); // редирект на профиль после успешной регистрации
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Registration failed",
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form
        className={css.form}
        onSubmit={handleSubmit}
      >
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            minLength={6}
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
          >
            Register
          </button>
        </div>

        {error && (
          <p className={css.error}>{error}</p>
        )}
      </form>
    </main>
  );
}
