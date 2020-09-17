
import Layout from '../../components/layout'
import Link from 'next/link'

import { prepareData } from 'include/catalog/prepareData'
 
const CatalogID = (props) => {

    let id = props.obj.id || "unknown"
    let parent = props.obj.parent || "root"
    let title = props.obj.title || "unknown"
    let list = props.list || []
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
                    {list.map((el) => {
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
    let res = await prepareData({ import: "./public/1cbitrix/import.xml", offers: "./public/1cbitrix/offers.xml" })

    const fsp = require('fs').promises
    let category = []
    let data = await fsp.readFile(res.categoryFilename)
    category = JSON.parse(data)

    let all = new Map(category)
    let obj = {}
    for (let pair of all.entries()) {
        let row = Object.fromEntries(pair[1])
        if(row.id === context.params.slug){
            obj = row
        }
    }
    let list = []
    console.log("all.entries", all.entries())
    for (let pair of all.entries()) {
        let row = Object.fromEntries(pair[1])
        console.log("id", row.id)
        console.log("parent", row.parent)
        console.log("\n")
        
        if(obj.id === row.parent){
            list.push(row)
        }
    }

    return {
        props: {
            obj,
            list
        }
    }
}

export async function getStaticPaths() {
    let res = await prepareImport("./public/1cbitrix/import.xml")
    let price = await prepareOffers("./public/1cbitrix/offers.xml")

    const fsp = require('fs').promises
    let category = []
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


