import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");
  posts.sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return rss({
    title: "Díaz — Blog",
    description:
      "Un cuaderno técnico con guías prácticas, debugging, terminal y pequeños atajos para desarrollar con menos fricción.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      link: `/${post.id}/`,
    })),
  });
}
