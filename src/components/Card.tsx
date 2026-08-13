import { slugifyStr } from "@utils/slugify";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
  variant?: "default" | "featured" | "compact";
}

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export default function Card({
  href,
  frontmatter,
  secHeading = true,
  variant = "default",
}: Props) {
  const { title, pubDatetime, description, tags, ogImage } = frontmatter;
  const coverUrl = typeof ogImage === "string" ? ogImage : ogImage?.src;
  const Heading = secHeading ? "h2" : "h3";
  const classes = [
    "article-card group",
    variant === "featured" ? "article-card--featured" : "",
    variant === "compact" ? "article-card--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={classes}>
      <a href={href} className="article-card__link">
        {(coverUrl || variant === "featured") && (
          <div
            className={`article-card__visual ${coverUrl ? "" : "article-card__visual--placeholder"}`}
            aria-hidden="true"
          >
            {coverUrl && (
              <img
                src={coverUrl}
                alt=""
                loading={variant === "featured" ? "eager" : "lazy"}
                decoding="async"
              />
            )}
          </div>
        )}
        <div className="article-card__content">
          <div className="article-card__meta">
            <time dateTime={new Date(pubDatetime).toISOString()}>
              {formatDate(pubDatetime)}
            </time>
            {tags?.[0] && (
              <>
                <span aria-hidden="true">·</span>
                <span>{tags[0]}</span>
              </>
            )}
          </div>
          <Heading
            style={{ viewTransitionName: slugifyStr(title) }}
            className="article-card__title"
          >
            {title}
          </Heading>
          <p className="article-card__description">{description}</p>
          <span className="article-card__read-more">继续阅读</span>
        </div>
      </a>
    </li>
  );
}
