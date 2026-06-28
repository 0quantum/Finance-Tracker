import { redirect } from "next/navigation";
import { siteConfig } from "@/src/config/site";

export default function Home() {
  redirect(siteConfig.redirects.afterLogin);
}