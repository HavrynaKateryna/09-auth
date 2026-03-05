import Link from "next/link";
import css from "./ProfilePage.module.css";
import { Metadata } from "next";
import { getServerMe } from "@/lib/api/serverApi"; // ✅ импорт правильный

export async function generateMetadata(): Promise<Metadata> {
  const user = await getServerMe();
  return {
    title: `Info about: ${user.username}`,
    description: `${user.avatar}`,
    openGraph: {
      type: "website",
      url: `http://localhost:3000/profile`,
      title: `Info about: ${user.username}`,
      description: `${user.avatar}`,
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
}

export default async function Profile() {
  const user = await getServerMe(); // ✅ исправлено
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>
            Profile Page
          </h1>
          <Link
            href="/profile/edit"
            className={css.editProfileButton}
          >
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <img
            src={user.avatar}
            alt={user.username}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>{`Username: ${user.username}`}</p>
          <p>{`Email: ${user.email}`}</p>
        </div>
      </div>
    </main>
  );
}
