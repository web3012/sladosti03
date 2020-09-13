import Layout from '../../components/layout'
import { getAllNews } from '@api/news'
import { getConfig } from '@api/index'
import Link from 'next/link'

const News = (props) => {

    console.log("props", props)


    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    ***
                </div>
            </div>

            <div className="pageContent">
                <p>Все новости...</p>
                <ul>
                    {props.news.map(function (row, i) {
                        return (
                            <li key={i}>
                                <Link href={'/news/' + row.slug}>
                                    <a>{row.title}</a>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    const config = await getConfig()
    const allNews = await getAllNews()

    return {
        props: {
            news: allNews,
            site_title: config.site_title,
            site_description: config.site_description
        }
    }
}

export default News