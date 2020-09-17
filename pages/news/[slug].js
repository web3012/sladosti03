
import Layout from '../../components/layout'
import { getNewsBySlug, getAllNews } from '@api/news'
import Link from 'next/link'

const NewsRead = (props) => {

    //console.log("props", props)


    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    ***
                </div>
            </div>

            <div className="pageContent">
                <p>Новость подробно...</p>
                <h2>{props.title}</h2>
                <div dangerouslySetInnerHTML={{__html:props.content}}/>
                <div><Link href='/news'><a>Назад</a></Link></div>
            </div>
        </Layout>
    )
}

export async function getStaticProps(context) {
    return {
        props: await getNewsBySlug(context.params.slug)
    }
}

export async function getStaticPaths() {
    let paths = await getAllNews()

    paths = paths.map(row => (
        { params: { slug: row.slug }}
    ))

    console.log("paths", paths)
    
    return {
        paths: paths,
        fallback: false
    }
}

export default NewsRead