import Layout from '@app/components/layout'
import Link from 'next/link'
import { prepareImport, prepareOffers } from '@app/include/catalog/prepareData'
import AddBtn from '@app/components/shop/AddBtn'

const ProductID = (props) => {
    let obj = props.obj ?? {}
    let price = props.price ?? {}
    let bcrumbs = props.bcrumbs || []

    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    ***
                </div>
            </div>

            <div className="pageContent">

                <p>
                    <Link href={`/catalog`}><a>Каталог товаров</a></Link>
                    {bcrumbs.map((el) => {
                        return (
                            <React.Fragment key={el.id} >
                                &nbsp;/&nbsp;<Link href={`/catalog/${el.id}`}><a>{el.title}</a></Link>
                            </React.Fragment>
                        )
                    })}
                </p>

                <h2>Продукт "{obj.Наименование}"</h2>

                <p>Штрихкод: {obj.Штрихкод}</p>
                <p>Артикул: {obj.Артикул}</p>

                <img src={`/1cbitrix/${obj.Картинка}`} alt={obj.Наименование} />

                <p>Цена: {price.Представление}</p>
                <p>Количество: {price.Количество}</p>

                <p>
                    <AddBtn id={obj.Ид} />
                </p>

            </div>
        </Layout>
    )
}
export default ProductID

export async function getStaticProps(context) {
    const fsp = require('fs').promises

    let resImport = await prepareImport("./public/1cbitrix/import.xml")
    let resOffers = await prepareOffers("./public/1cbitrix/offers.xml")

    // Продукт 
    let a = JSON.parse(await fsp.readFile(resImport.productsFilename))
    let obj = null

    for (let row of a) {
        obj = Object.fromEntries(row)
        obj.category = []
        if (obj.Ид === context.params.slug) {
            // obj.link [['id', 'c2724d1a-2b0a-11e8-9c41-2c56dc35b347']] -> obj.category ['c2724d1a-2b0a-11e8-9c41-2c56dc35b347']
            if (Array.isArray(obj.link)) {
                obj.link.map(el => {
                    obj.category.push(el[1])
                })
                delete obj.link
            }
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
    // console.log("obj", obj)
    // console.log("price", price)

    // Хлебные крошки
    a = JSON.parse(await fsp.readFile(resImport.categoryFilename))
    a = new Map(a)

    let bcrumbs = []
    const search = (a, id) => {
        let curr = a.get(id)
        curr = Object.fromEntries(curr)

        bcrumbs.push(curr)

        if (curr.parent === 'root') return

        for (let row of a.values()) {
            row = Object.fromEntries(row)

            if (curr.parent == row.id) {
                search(a, row.id)
                break
            }
        }
    }
    search(a, obj.category[0])
    bcrumbs = bcrumbs.reverse()



    return {
        props: {
            obj,
            price,
            bcrumbs
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

    return {
        paths: paths,
        fallback: false
    }


}




