import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'

const postsDirectory = path.join(process.cwd(), 'blog')

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory) // an array of all file names
    const allPostsData = fileNames.map(fileName => {    
      const slug = fileName.replace(/\.mdx$/, '') 
      
      const fullPath = path.join(postsDirectory, fileName) 
      const fileContents = fs.readFileSync(fullPath, 'utf8')
  
      const matterResult = matter(fileContents) 
  
      return {
        slug, 
        fileContents,
        ...matterResult.data
      }
    }) // [{slug: 'pre-rendering', title: '...', date: '...'}, {slug: 'ssg-ssr', title: '...', date: '...'}]

    const publishedPostsData = [];
    for (const postData of allPostsData){
      if (postData.isPublished === true) {
        publishedPostsData.push(postData)
      };
    }

    const sortedPublishedPostsData = publishedPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1
        } else if (a > b) {
            return -1
        } else {
            return 0
        }
    })

    return sortedPublishedPostsData;
    
} // this function returns an array of post metadata (slug and stuff in front matter) sorted by date

export function getAllPostSlugs() {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames.map(fileName => {
        return {
            params: {
                slug: fileName.replace(/\.mdx$/, '')
            }
        };
    });
} // this function returns an array of “params” objects [{param: {slug: '..'}}, {param: {slug: '..'}}, ...]

export async function getPostData(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    if (process.platform === 'win32') {
        process.env.ESBUILD_BINARY_PATH = path.join(
          process.cwd(),
          'node_modules',
          'esbuild',
          'esbuild.exe',
        )
      } else {
        process.env.ESBUILD_BINARY_PATH = path.join(
          process.cwd(),
          'node_modules',
          'esbuild',
          'bin',
          'esbuild',
        )
      }      

    const { code, frontmatter } = await bundleMDX({
      source: fileContents,
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm, remarkUnwrapImages]        
        return options;
      },
    });

    return {
        slug,
        frontmatter,
        code,
    };
} // this function returns a post object based on the slug passed to it (code part)

