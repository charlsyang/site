import fs from 'fs';
import { Feed } from "feed";
import { getSortedPostsData } from "./blog";

const allPosts = getSortedPostsData();

// Convert to markdown to html string
const showdown  = require('showdown');
const converter = new showdown.Converter({metadata: true, omitExtraWLInCodeBlocks: true, tables: true});
allPosts.map((post) => {
  post.content = converter.makeHtml(post.fileContents); // create a new “content” key for html string
})

export default async function generateRSSFeed() {
  const siteURL = process.env.VERCEL_URL;
  const date = new Date();
  const author = {
    name: "Charlsy Yang",
    email: "hi@charlsy.me",
    link: "https://charlsyang.com"
  }

  const feed = new Feed({
    title: "Charlsy’s Blog",
    description: "Charlsy’s place on the web, a digital garden where he grows his half-baked ideas and budding thoughts.",
    id: siteURL,
    link: siteURL,
    copyright: `All rights reserved ${date.getFullYear()}, Charlsy Yang`,
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
      author: [author],
      date: new Date(date),
    });
  });

  fs.writeFileSync('public/feed.xml', feed.rss2());
}
