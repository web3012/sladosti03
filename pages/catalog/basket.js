import Layout from '@app/components/layout'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { prepareOffers } from '@app/include/catalog/prepareData'
import {events} from '@app/components/global/events'

import Link from 'next/link'
import TextField from '@material-ui/core/TextField';

const BasketPage = (props) => {
    let price = props.price ?? []
    price = new Map(price)

    let a = []
    if (typeof window !== "undefined") {
        a = JSON.parse(localStorage.getItem('zakaz')) || []
    }
    const [items, setItems] = React.useState(a)

    const cleanInt = (n) => {
        n = Number(n)
        return n >= 0 ? Math.floor(n) : 0
    }

    const change = (e, id) => {
        let a = []
        items.map(el=>{
            if(el.id === id){
                el.count = cleanInt(e.target.value)
            }
            a.push(el)
        })
        setItems(a)
        localStorage.setItem("zakaz", JSON.stringify(a))
        events.emit('updateZakaz')
    }

    const del = (id) => {
        console.log("id", id)
        
        let a = []
        items.map(el=>{
            if(el.id !== id){
                a.push(el)
            }            
        })
        setItems(a)
        localStorage.setItem("zakaz", JSON.stringify(a))
        events.emit('updateZakaz')
    }

    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    <p>***</p>
                </div>
            </div>

            <div className="pageContent">
                <p>Корзина...</p>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Наименование</th>
                            <th>Количество</th>
                            <th>Цена</th>
                            <th>Единица</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(elem => {
                            if(price.has(elem.id)){
                                let dat = price.get(elem.id)
                                return (
                                    <tr key={elem.id}>
                                        <td>{dat.Наименование}</td>
                                        <td style={{width:"120px"}}>
                                            <input type="text" name={`count[${elem.id}]`} value={elem.count} size="5" onChange={(e)=>change(e, elem.id)}/>
                                            <DeleteForeverIcon onClick={()=>del(elem.id)}/>
                                        </td>
                                        <td>{dat.ЦенаЗаЕдиницу} {dat.Валюта}</td>
                                        <td>{dat.Единица}</td>
                                    </tr>
                                )
                            }else{
                                return (
                                    <tr key={elem.id}>
                                        <td>ID: {elem.id}</td>
                                        <td>{elem.count}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                )
                            }

                        })}
                    </tbody>
                </table>

            </div>
        </Layout>
    )
}

export default BasketPage


export async function getStaticProps(context) {

    const fsp = require('fs').promises
    let resOffers = await prepareOffers("./public/1cbitrix/offers.xml")

    let list = []
    let price = JSON.parse(await fsp.readFile(resOffers.priceFilename))
    price.map(el => {
        let obj = Object.fromEntries(el)
        list.push([obj.Ид, obj])
    })

    return {
        props: {
            price: list
        }
    }
}

