import Layout from '@app/components/layout'
import Link from 'next/link'
import AddBtn from '@app/components/shop/AddBtn'

import {prepareImport, prepareOffers} from '@app/include/catalog/prepareData'


const Catalog = (props) => {

    let a = []
    if (typeof window !== "undefined") {
        a = JSON.parse(localStorage.getItem('zakaz')) || []
        //console.log("typeof a", typeof a)
        localStorage.setItem("zakaz", JSON.stringify(a))
    }
    const [zakaz, setZakaz] = React.useState(a)    
    
    const life = props.life
    const category = props.category
    let products = props.products || []
    let price = props.price || []

    const all = new Map(category)
    const [currentID, setCurrentID] = React.useState("root")
    const [list, setList] = React.useState([])
    
    React.useEffect(() => {
        let res = []
        for (let pair of all.entries()) {
            let obj = Object.fromEntries(pair[1])
            if(obj.parent === currentID){
                res.push(obj)
            }
        }
        setList(res)
    }, [currentID])

    return (
        <Layout>
            <div className="pageContent">
                <h2>Каталог товаров</h2>
                <ul className="catalogIndex">
                    {list.map((el) => {
                        let style = {}
                        if(el.pic){
                            style = {
                                background: `url(/1cbitrix/${el.pic})`
                            }
                        }

                        return (
                            <li key={el.id} style={style}><Link href={`/catalog/${el.id}`}><a>{el.title}</a></Link></li>
                        )
                    })}
                </ul>
                <h3>Новинки</h3>
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
                                    <td className="thumbnail">
                                        {el.Картинка && <img src={`/1cbitrix/${el.Картинка}`} alt={el.Наименование}/>}
                                    </td>
                                    <td><Link href={`/catalog/item/${el.Ид}`} as={`/catalog/item/${el.Ид}`}><a>{el.Наименование}</a></Link></td>
                                    <td className="price">{dat.Представление}</td>
                                    <td className="tobasket"><AddBtn id={dat.Ид} zakaz={zakaz} /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                
            </div>
        </Layout>
    )
}

export async function getStaticProps(context) {


    let resImport = await prepareImport("./public/1cbitrix/import.xml")
    let resOffers = await prepareOffers("./public/1cbitrix/offers.xml")

    const fsp = require('fs').promises
    
    let data
    let category = []
    let products = []

    data = await fsp.readFile(resImport.categoryFilename)
    category = JSON.parse(data)

    

    // Продукты категории
    data = JSON.parse(await fsp.readFile(resImport.productsFilename))
    let n = 0
    let need = []
    data.map(el => {
        let row = Object.fromEntries(el)
        if(row.new && row.new === "true"){
            products.push(row)
            need.push(row.Ид) 
        }
    })

    // Прайсы
    data = JSON.parse(await fsp.readFile(resOffers.priceFilename))
    let price = []
    data.map(el => {
        if (need.includes(el[0][1])) {
            let row = Object.fromEntries(el)
            price.push(row)
        }
    })


    return {
        props: {
            category,
            products,
            price,
            life: resImport.life
        }
    }
}

export default Catalog
