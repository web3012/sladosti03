
import Layout from '@app/components/layout'
import Link from 'next/link'

import { prepareImport, prepareOffers } from '@app/include/catalog/prepareData'
import { Breadcrumbs } from '@material-ui/core'
import AddBtn from '@app/components/shop/AddBtn'

import {StoreContext} from '@app/components/global/context.js'
import { events } from '@app/components/global/events'


const CatalogID = (props) => {

    let a = []
    if (typeof window !== "undefined") {
        a = JSON.parse(localStorage.getItem('zakaz')) || []
        //console.log("typeof a", typeof a)
        localStorage.setItem("zakaz", JSON.stringify(a))
    }

    const [zakaz, setZakaz] = React.useState(a)
    const {state, dispatch, n} = React.useContext(StoreContext)

    //localStorage.setItem("zakaz", JSON.stringify(action.zakaz))

    let id = props.current.id || "unknown"
    let parent = props.current.parent || "root"
    let title = props.current.title || "unknown"
    let category = props.category || []
    let products = props.products || []
    let price = props.price || []
    let bcrumbs = props.bcrumbs || []
    let backURL

    events.on('updateZakaz', () => {
        // Перечитать localStorage
        a = JSON.parse(localStorage.getItem('zakaz')) || []
        setZakaz(a)
    })

    React.useEffect(() => {
        console.log("zakaz-1", zakaz)
        //dispatch({type: 'ZAKAZ_SET', zakaz: zakaz}) // глобвльный state
    }, []) //The empty array causes this effect to only run on mount

    React.useEffect(() => {
        console.log("zakaz-2", zakaz)
    })


    if (parent === "root") {
        backURL = "/catalog"
    } else {
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
                <p>
                    <Link href={`/catalog`}><a>Каталог товаров</a></Link>
                    {bcrumbs.map((el) => {
                        return (
                            <React.Fragment key={el.id}>
                                &nbsp;/&nbsp;<Link href={`/catalog/${el.id}`}><a>{el.title}</a></Link>
                            </React.Fragment>
                        )
                    })}
                </p>


                <p>Каталог "{title}"</p>
                <ul>
                    {category.map((el) => {
                        return (
                            <li key={`id-${el.id}`}><Link href={`/catalog/${el.id}`} as={`/catalog/${el.id}`}><a>{el.title}</a></Link></li>
                        )
                    })}
                </ul>

                <table>
                    <tbody>
                        {products.map((el) => {
                            let dat = {}
                            for (let i = 0; i < price.length; i++) {
                                if (price[i].Ид === el.Ид) {
                                    dat = price[i]
                                    break;
                                }
                            }

                            return (
                                <tr key={`id-${el.Ид}`}>
                                    <td><Link href={`/catalog/item/${el.Ид}`} as={`/catalog/item/${el.Ид}`}><a>{el.Наименование}</a></Link></td>
                                    <td>{dat.Представление}</td>
                                    <td><AddBtn id={dat.Ид} zakaz={zakaz}/></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        </Layout >
    )
}


export default CatalogID

export async function getStaticProps(context) {
    const fsp = require('fs').promises

    let resImport = await prepareImport("./public/1cbitrix/import.xml")
    let resOffers = await prepareOffers("./public/1cbitrix/offers.xml")

    let a = JSON.parse(await fsp.readFile(resImport.categoryFilename))
    a = new Map(a)

    // Текущая директория
    let current = {}
    for (let pair of a.entries()) {
        let row = Object.fromEntries(pair[1])
        if (row.id === context.params.slug) {
            current = row
        }
    }

    // Хлебные крошки
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
    search(a, current.id)
    bcrumbs = bcrumbs.reverse()

    //console.log("breadcrumbs>>>>>>>", bcrumbs)


    // Поддиректории
    let category = []
    for (let pair of a.entries()) {
        let row = Object.fromEntries(pair[1])
        if (current.id === row.parent) {
            category.push(row)
        }
    }

    // Продукты категории
    a = JSON.parse(await fsp.readFile(resImport.productsFilename))
    let products = []
    let n = 0
    let need = []
    a.map(el => {
        let row = Object.fromEntries(el)
        row.link.map(link => {
            if (link[1] == current.id) {
                //row.meta = Object.fromEntries(row.meta)
                products.push(row)
                need.push(row.Ид) // для прайса
            }
        })
    })

    // Прайсы
    a = JSON.parse(await fsp.readFile(resOffers.priceFilename))
    let price = []
    a.map(el => {
        if (need.includes(el[0][1])) {
            let row = Object.fromEntries(el)
            price.push(row)
        }
    })

    return {
        props: {
            current,
            category,
            products,
            price,
            bcrumbs
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
        paths.push({ params: { slug: obj.id } })
    }

    return {
        paths: paths,
        fallback: false
    }
}


