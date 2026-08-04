import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/AuthCard";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage(
  props: PageProps<"/reinitialiser/[token]">,
) {
  const { token } = await props.params;

  return (
    <AuthCard title="Réinitialiser le mot de passe">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
