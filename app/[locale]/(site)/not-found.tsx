import type { Metadata } from "next";
import { NotFoundContent } from "@/components/site/NotFoundContent";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function SiteNotFound() {
  return <NotFoundContent />;
}
