import { Metadata } from "next";
import css from "./Home.module.css";

export const metadata: Metadata = {
  title: "404! Page not found",
  description: "Not Found Page",
  openGraph: {
    type: "website",
    url: "http://localhost:3000/not-found",
    title: "404! Page not found",
    description: "Not Found Page",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 600,
        height: 300,
        alt: "Notehub main logo",
      },
    ],
  },
};
export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>
        404 - Page not found
      </h1>
      <p className={css.description}>
        Sorry, the page you are looking for does
        not exist.
      </p>
    </>
  );
}
