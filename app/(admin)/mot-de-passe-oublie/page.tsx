import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/AuthCard";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Mot de passe oublié"
      description="Recevez un lien de réinitialisation par email."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
