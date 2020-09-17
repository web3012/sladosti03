import Layout from '../../components/layout'
import Link from 'next/link'

import {prepareImport, prepareOffers} from 'include/catalog/prepareData'


const Catalog = (props) => {

    const life = props.life
    

    const category = props.category
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
            <div className="pageSidebar">
                <div className="_block">
                    <p>***</p>
                </div>
            </div>

            <div className="pageContent">
                <p>Каталог...</p>
                <ul>
                    {list.map((el) => {
                        return (
                            <li key={el.id}><Link href={`/catalog/${el.id}`}><a>{el.title}</a></Link></li>
                        )
                    })}
                </ul>
            </div>
        </Layout>
    )
}

export async function getStaticProps(context) {

    let res = await prepareImport("./public/1cbitrix/import.xml")
    let price = await prepareOffers("./public/1cbitrix/offers.xml")

    const fsp = require('fs').promises
    
    let data
    let category = []
    let products = []

    data = await fsp.readFile(res.categoryFilename)
    category = JSON.parse(data)

    data = await fsp.readFile(res.productsFilename)
    products = JSON.parse(data)

    return {
        props: {
            category,
            products,
            life: res.life
        }
    }
}

export default Catalog
