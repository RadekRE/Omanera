import type { ReactNode } from "react";
import "../tokens.css";
import "../globals.css";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export default function AdminRoot({ children }: { children: ReactNode }) {
  return <html lang="cs"><body>{children}</body></html>;
}
