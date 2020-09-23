import React from "react"
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {events} from '@app/components/global/events'

const ToplineInfo = () => {

    let a = []
    if (typeof window !== "undefined") {
        a = JSON.parse(localStorage.getItem('zakaz')) || []
    }
    const [count, setCount] = React.useState(a.length)

    events.on('updateZakaz', () => {
        a = JSON.parse(localStorage.getItem('zakaz')) || []
        setCount(a.length)
    })

    return (
        <span style={{verticalAlign: "middle"}}><ShoppingCartIcon fontSize="small" style={{position:"relative", top:"5px", left:"5px"}}/> &nbsp;&nbsp;<a href="/catalog/basket">{count} товаров</a></span>
    )
}

export default ToplineInfo