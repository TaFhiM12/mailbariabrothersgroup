"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const APP_NAME = "Mailbaria Brothers Group";

const pageTitles: Record<string, string> = {
  "/": APP_NAME,
  "/login": "Login",
  "/register": "Register",
  "/forgot-password": "Forgot Password",
  "/reset-password": "Reset Password",
  "/dashboard": "Dashboard",
  "/savings": "Savings",
  "/expenses": "Expenses",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/notices": "Notices",
  "/members": "Members",
  "/reports": "Reports",
  "/audit-logs": "Audit Logs",
  "/settings": "Settings",
};

const formatSegment = (segment: string) =>
  segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function PageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
    const pageTitle =
      pageTitles[normalizedPath] ||
      formatSegment(normalizedPath.split("/").filter(Boolean).at(-1) || "");

    document.title =
      normalizedPath === "/" || pageTitle === APP_NAME
        ? APP_NAME
        : `${pageTitle} | ${APP_NAME}`;
  }, [pathname]);

  return null;
}
