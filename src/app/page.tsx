import type { Metadata } from "next";
import { HomeView } from "@/components/HomeView";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  path: "/",
});

const HomePage = () => <HomeView />;

export default HomePage;
