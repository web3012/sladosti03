import React, {useEffect, useState} from "react"
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {events} from '@app/components/global/events'

const ToplineInfo = () => {

    const [init, setInit] = useState(false)
    const [count, setCount] = useState(0)
    
    const updateCount = () => {
        //console.log('updateCount')

        let f = ()=>{
            let n = 0
            let items = JSON.parse(window.localStorage.getItem('zakaz')) || []
            items.map(elem => {if(elem.count > 0) n++})
            return n
        }
        let p1 = new Promise((resolve, reject) => {
            setTimeout(resolve(f()), 1000)
        })
        Promise.all([p1]).then(values => { 
            setCount(values[0])
        })

    }
    
    useEffect(() => {
        if(!init){
            //console.log("Init update.....")

            events.on('updateZakaz', () => {
                setTimeout(updateCount, 1000)
            })
            events.emit('updateZakaz')

            setInit(true)
        }
    })

    return (
        <span style={{verticalAlign: "middle"}}><ShoppingCartIcon fontSize="small" style={{position:"relative", top:"5px", left:"5px"}}/> &nbsp;&nbsp;<a href="/catalog/basket">{count} товаров</a></span>
    )
}

export default ToplineInfo