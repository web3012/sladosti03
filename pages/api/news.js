/**
 * Импорт всех новостей из @news/
 */ 

import matter from 'gray-matter'
import marked from 'marked'

export async function getAllNews() {

    const posts = []
    const context = require.context('../../data/_news', false, /\.md$/)


    for (const key of context.keys()) {
        const post = key.slice(2)
        const content = await import(`../../data/_news/${post}`)

        const meta = matter(content.default)

        posts.push({
            slug: post.replace('.md', ''),
            title: meta.data.title
        })
    }

    console.log("posts", posts)

    return posts;
}

export async function getNewsBySlug(slug) {
    const fileContent = await import(`../../data/_news/${slug}.md`)

    const meta = matter(fileContent.default)
    const content = marked(meta.content)
    
    return {
        title: meta.data.title,
        content: content
    }
}