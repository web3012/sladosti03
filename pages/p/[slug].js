import Layout from '@app/components/layout'
import Link from 'next/link'
import { request, gql } from 'graphql-request'

const API_URL = "http://94.103.92.20:1337/graphql"

const Page = (props) => {

    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    {props.title}
                </div>
            </div>

            <div className="pageContent">
                {props.content}
            </div>
        </Layout>
    )
}

export async function getStaticProps(context) {

    let title = ""
    let content = ""
    
    try {
        const data = await request(API_URL, gql`
        {
            pages (where: { slug: "${context.params.slug}" }) {
                id
                title
                slug
                content
            }
        }
        `)
        title = data.pages[0].title
        content = data.pages[0].content
        
    } catch (err) {
        console.log("Error GraphQL:", err)
    }

    return {
        props: {
            title,
            content
        }
    }
}

export async function getStaticPaths() {

    let paths = []

    try {
        const data = await request(API_URL, gql`{ pages { id slug } }`)
        for (let val of data.pages) {
            paths.push({ params: { slug: val.slug } })
        }
    } catch (err) {
        console.log("Error GraphQL:", err)
    }

    console.log("paths", paths)
    

    return {
        paths: paths,
        fallback: false
    }
}

export default Page