import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

const DEMO_POST_SLUGS = new Set([
  "adding-new-post",
  "adding-new-posts-in-astropaper-theme",
  "astro-paper-2",
  "astro-paper-3",
  "astro-paper-4",
  "astro-paper-v3",
  "astro-paper-v4",
  "customizing-astropaper-theme-color-schemes",
  "dynamic-og-images",
  "dynamic-og-image-generation-in-astropaper-blog-posts",
  "example-draft-post",
  "how-to-add-an-estimated-reading-time",
  "how-to-add-estimated-reading-time",
  "how-to-add-a-new-social-icon",
  "how-to-configure-astropaper-theme",
  "how-to-connect-astro-paper-blog-with-forestry-cms",
  "how-to-update-dependencies",
  "how-do-i-develop-my-portfolio-and-blog",
  "how-do-i-develop-my-terminal-portfolio-website-with-react",
  "portfolio-website-development",
  "predefined-color-schemes",
  "setting-dates-via-git-hooks",
  "tailwind-typography",
  "terminal-development",
]);

const postFilter = ({ data, slug }: CollectionEntry<"blog">) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return (
    !DEMO_POST_SLUGS.has(slug) &&
    !data.draft &&
    (import.meta.env.DEV || isPublishTimePassed)
  );
};

export default postFilter;
