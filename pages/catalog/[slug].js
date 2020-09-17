
import Layout from '../../components/layout'
import Link from 'next/link'

import { prepareImport, prepareOffers } from 'include/catalog/prepareData'
 
const CatalogID = (props) => {

    let id = props.current.id || "unknown"
    let parent = props.current.parent || "root"
    let title = props.current.title || "unknown"
    let category = props.category || []
    let backURL
    
    if(parent === "root"){
        backURL = "/catalog"
    }else{
        backURL = `/catalog/${parent}`
    }

    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    ***
                </div>
            </div>

            <div className="pageContent">
                <p><Link href={backURL}><a>Назад</a></Link></p>
                <p>Каталог "{title}"</p>
                <ul>
                    {category.map((el) => {
                        return (
                            <li key={`id-${el.id}`}><Link href={`/catalog/${el.id}`} as={`/catalog/${el.id}`}><a>{el.title}</a></Link></li>
                        )
                    })}
                </ul>                
            </div>
        </Layout>
    )
}
export default CatalogID

export async function getStaticProps(context) {
    let res = await prepareImport("./public/1cbitrix/import.xml")
    let price = await prepareOffers("./public/1cbitrix/offers.xml")

    const fsp = require('fs').promises
    
    let data = await fsp.readFile(res.categoryFilename)
    let a = JSON.parse(data)

    a = new Map(a)
    let current = {}
    for (let pair of a.entries()) {
        let row = Object.fromEntries(pair[1])
        if(row.id === context.params.slug){
            current = row
        }
    }

    let category = []
    for (let pair of a.entries()) {
        let row = Object.fromEntries(pair[1])
        if(current.id === row.parent){
            category.push(row)
        }
    }

    return {
        props: {
            current,
            category
        }
    }
}

export async function getStaticPaths() {
    let res = await prepareImport("./public/1cbitrix/import.xml")

    let category = []
    const fsp = require('fs').promises
    let data = await fsp.readFile(res.categoryFilename)
    category = JSON.parse(data)

    let paths = []
    let all = new Map(category)
    for (let pair of all.entries()) {
        let obj = Object.fromEntries(pair[1])
        paths.push({params: {slug: obj.id}})
    }

    return {
        paths: paths,
        fallback: false
    }
}


