import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/actions/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata: Metadata = { title: "Paramètres", robots: { index: false, follow: false } };

export default async function ParametresAdminPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-h2 text-ink">Paramètres</h1>
      <div className="mt-6 flex flex-col gap-6">
        <SettingsForm settings={settings} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
