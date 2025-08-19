import React from "react";

import { BlogLayout } from "@/components/blog-layout";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import ClientSlugHandler from "../../ClientSlugHandler";

export default async function SingleArticlePage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const article = await fetchContentType(
    "articles",
    {
      filters: {
        slug: params.slug,
      }
    },
    true,
  );

  if (!article) {
    return <div>Blog not found</div>;
  }

  return (
    <BlogLayout article={article} locale={'zh'}>
      <BlocksRenderer content={article.content} />
    </BlogLayout>
  );
}
