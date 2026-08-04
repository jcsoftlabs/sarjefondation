import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthCard title="Connexion" description="Accès réservé à l'équipe de la fondation.">
      <LoginForm />
    </AuthCard>
  );
}
