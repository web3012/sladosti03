import Layout from '../../../components/layout'
import Link from 'next/link'

import { prepareImport, prepareOffers } from 'include/catalog/prepareData'

const ProductID = (props) => {
    let obj = props.obj ?? {}
    let price = props.obj ?? {}

    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    ***
                </div>
            </div>

            <div className="pageContent">
                <p>Продукт "{obj.title}"</p>

                <img src={`/1cbitrix/${obj.pic}`} alt={obj.title}/>

            </div>
        </Layout>
    )
}
export default ProductID


export async function getStaticProps(context) {
    const fsp = require('fs').promises

    let resImport = await prepareImport("./public/1cbitrix/import.xml")
    let resOffers = await prepareOffers("./public/1cbitrix/offers.xml")

    // Продукты категории
    let a = JSON.parse(await fsp.readFile(resImport.productsFilename))
    let product = null

    let n = 0
    let obj = null

    for (let row of a) {
        obj = Object.fromEntries(row)
        if(obj.id === context.params.slug){
            break
        }
    }

    // Прайс
    a = JSON.parse(await fsp.readFile(resOffers.priceFilename))
    let price = null
    for (let row of a) {
        if (row[0][1] === context.params.slug) {
            price = Object.fromEntries(row)
            break
        }
    }
    console.log("obj", obj)
    console.log("price", price)
    


    return {
        props: {
            obj,
            price
        }
    }
}

export async function getStaticPaths() {
    const fsp = require('fs').promises

    let resOffers = await prepareOffers("./public/1cbitrix/offers.xml")
    let a = JSON.parse(await fsp.readFile(resOffers.priceFilename))

    let n = 0

    let paths = []
    a.map((el) => {
        let obj = Object.fromEntries(el)
        paths.push({ params: { slug: obj.Ид } })
    })

    //console.log("paths", paths)
    
    return {
        paths: paths,
        fallback: false
    }
    
    
}




