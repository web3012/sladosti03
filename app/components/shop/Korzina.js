import React, {useEffect, useState} from "react"
import TovarTitle from "../catalog/TovarTitle"

import { InputNumber } from 'antd'
import 'antd/dist/antd.css'

const Korzina = (props) => {

    const [init, setInit] = useState(false)
    const [items, setItems] = useState([])

    useEffect(() => {
        if(!init){
            let a = JSON.parse(window.localStorage.getItem('zakaz')) || []
            setItems(a)
            setInit(true)
        }else{

        }

    })

    return (
        <div style={{margin: "20px 0"}}>

            <table className="table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Цена, руб</th>
                    <th>Количество</th>
                    </tr>
                </thead>
                <tbody>
                {items.map(elem=>{
                        if(elem.count){
                            return (
                                <tr key={elem.id}>
                                <td style={{width:"60px"}}>{elem.id}</td>
                                <TovarTitle id={elem.id}/>
                                <td style={{width:"60px"}}>
                                    <InputNumber min={1} max={1000} defaultValue={elem.count} onChange={()=>{}} />
                                </td>
                                
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Korzina