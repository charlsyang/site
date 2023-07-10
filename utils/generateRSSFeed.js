import fs from 'fs';
import ReactDOMServer from 'react-dom/server'
import { Feed } from "feed";
import { getSortedPostsData, getPostData } from "./blog";
import { getMDXComponent } from "mdx-bundler/client";

const allPosts = getSortedPostsData();

// Convert to markdown to html string
for (let i=0; i < allPosts.length; i++) {
  const {code} = await getPostData(allPosts[i].slug); // Get code
  const RenderedPost = getMDXComponent(code); // Get rendered post
  const html = ReactDOMServer.renderToStaticMarkup(<RenderedPost/>); // Turn into html
  allPosts[i].content = html;
}

export default async function generateRSSFeed() {
  const siteURL = 'https://charlsyang.com';
  const date = new Date();
  const author = {
    name: "Charlsy Yang",
    email: "hi@charlsy.me",
    link: "https://charlsyang.com"
  }

  const feed = new Feed({
    title: "Charlsy Yang",
    description: "Half-baked ideas and budding thoughts.",
    id: siteURL,
    link: siteURL,
    copyright: `All rights reserved ${date.getFullYear()}, Charlsy Yang`,
    favicon: `${siteURL}/favicons/favicon.ico`,
    updated: date, // today's date
    language: 'en',
    feedLinks: {
      rss2: `${siteURL}/feed.xml`, 
    },
    author,
  });

  allPosts.forEach((post) => {
    const {slug, content, title, date, excerpt } = post;

    const url = `${siteURL}/blog/${slug}`;

    feed.addItem({
      title: title,
      id: url,
      link: url,
      description: excerpt,
      content: content,
      author: 'Charlsy Yang',
      date: new Date(date),
    });
  });

  fs.writeFileSync('public/feed.xml', feed.rss2());
}
