import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import Card from "@components/Card";
import type { CollectionEntry } from "astro:content";

export type SearchItem = {
  title: string;
  description: string;
  data: CollectionEntry<"blog">["data"];
  slug: string;
};

interface Props {
  searchList: SearchItem[];
}
interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description", "data.tags"],
        includeMatches: true,
        minMatchCharLength: 1,
        threshold: 0.42,
      }),
    [searchList]
  );

  useEffect(() => {
    const searchStr =
      new URLSearchParams(window.location.search).get("q") ?? "";
    setInputVal(searchStr);
  }, []);

  useEffect(() => {
    setSearchResults(inputVal.trim() ? fuse.search(inputVal.trim()) : []);
    const params = new URLSearchParams(window.location.search);
    if (inputVal.trim()) params.set("q", inputVal.trim());
    else params.delete("q");
    const query = params.toString();
    history.replaceState(
      history.state,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`
    );
  }, [inputVal, fuse]);

  return (
    <div className="search-area">
      <label className="search-box">
        <span className="sr-only">搜索文章</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M10.5 3a7.5 7.5 0 1 0 4.73 13.32L20.91 22 22 20.91l-5.68-5.68A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          name="search"
          value={inputVal}
          onChange={event => setInputVal(event.currentTarget.value)}
          autoComplete="off"
          placeholder="输入标题、内容或标签……"
        />
      </label>

      {inputVal.trim() && (
        <p className="result-count">
          找到 <strong>{searchResults.length}</strong> 篇与“{inputVal.trim()}
          ”相关的文章
        </p>
      )}

      {inputVal.trim() && searchResults.length === 0 && (
        <div className="empty-search">
          <span aria-hidden="true">❦</span>
          <strong>暂时没有找到相关内容</strong>
          <p>换一个关键词试试看，或去文章列表随便走走。</p>
        </div>
      )}

      <ul className="search-results">
        {searchResults.map(({ item, refIndex }) => (
          <Card
            href={`/posts/${item.slug}/`}
            frontmatter={item.data}
            key={`${refIndex}-${item.slug}`}
          />
        ))}
      </ul>
    </div>
  );
}
