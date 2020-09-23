import React, { useEffect, useState } from "react"

import Badge from '@material-ui/core/Badge';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import { events } from '@app/components/global/events'

const AddBtn = (props) => {
    const id = props.id
    const zakaz = props.zakaz ?? []

    console.log("props", props)

    const [count, setCount] = useState(0)

    const add = (e, id) => {
        let a = []
        let item = zakaz.find(item => item.id == id)
        let finded = false
        zakaz.map(el => {
            if (el.id === id) {
                el.count = el.count + 1
                setCount(el.count)
                finded = true
            }
            a.push(el)
        })
        if (!finded) {
            a.push({ id: id, count: 1 })
            setCount(1)
        }
        localStorage.setItem("zakaz", JSON.stringify(a))
        events.emit('updateZakaz')
    }

    useEffect(() => {
        if (!zakaz.length) return //если zakaz еще не подгружен

        let item = zakaz.find(item => item.id == id)
        if (item !== undefined) {
            setCount(item.count)
        }
    }, [zakaz]) // только при изменении zakaz

    return (
        <React.Fragment>
            <Badge badgeContent={count} max={99} color="primary">
                <AddShoppingCartIcon onClick={(e) => add(e, id)} />
            </Badge>
        </React.Fragment>
    )
}
// invisible={!count} variant="dot"

export default AddBtn