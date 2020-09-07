import React from 'react'
import { StoreContext } from '../global/context'

const KorzinaCount = () => {
    const { state, dispatch } = React.useContext(StoreContext)

    return (
        <React.Fragment>
            <span>{state.counter} Корзина</span>
            &nbsp;<a onClick={() => dispatch({ type: "PLUS" })}>+</a>
            &nbsp;<a onClick={() => dispatch({ type: "MINUS" })}>-</a>
        </React.Fragment>
    )
}

export default KorzinaCount