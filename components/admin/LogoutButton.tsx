import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="secondary" className="px-3 py-2 text-xs">
        Déconnexion
      </Button>
    </form>
  );
}
