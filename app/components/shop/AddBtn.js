import React, {useEffect, useState} from "react"

import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveIcon from '@material-ui/icons/Remove';

import {events} from '../global'

const AddBtn = (props) => {

    const id = props.id

    const [init, setInit] = useState(false)
    const [item, setItem] = useState(0)

    const add = () => {
        let count = item.count
        count = count + 1
        setItem({id: id, count: count})
        
        //console.log("Add btn pressed !!")
        events.emit('updateZakaz')
    }
    
    const clean = () => {
        setItem({id: id, count: 0})
        events.emit('updateZakaz')
    }

    useEffect(() => {

        let items = JSON.parse(window.localStorage.getItem('zakaz')) || []
        
        if(!init){
            // init State from localStorage
            let item = items.find(item => item.id == id)
            if(item === undefined) item = {id: id, count: 0}
            setItem(item)        

            setInit(true)
        }else{
            // update localStorage from State
            let i = items.findIndex(item => item.id == id)
            if(i === -1){
                items.push(item)
            }else{
                items[i] = item
            }
            window.localStorage.setItem("zakaz", JSON.stringify(items))
        }

    })

    if(id){
        return (
            <React.Fragment>
            <Badge badgeContent={item.count} color="secondary" invisible={!item.count}>
                <Button
                    color="primary" 
                    size="small"
                    startIcon={<AddShoppingCartIcon/>}
                    onClick={add}        
                    onDoubleClick={clean}            
                    >
                </Button>
            </Badge>
            </React.Fragment>
        )
    }else{
        return (
            <Button color="primary" size="small" startIcon={<AddShoppingCartIcon/>} disabled>
                В корзину
            </Button>
        )

    }
}

export default AddBtn