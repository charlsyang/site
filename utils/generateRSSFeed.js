import fs from 'fs';
import { Feed } from "feed";
import { getSortedPostsData } from "./blog";

const allPosts = getSortedPostsData();

// Convert to markdown to html string
const showdown  = require('showdown');
showdown.setFlavor('github'); // set to GFM
const converter = new showdown.Converter({metadata: true, omitExtraWLInCodeBlocks: true, tables: true});
allPosts.map((post) => {
  post.content = converter.makeHtml(post.fileContents); // create a new “content” key for html string
})

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
