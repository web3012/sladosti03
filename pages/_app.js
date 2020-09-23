import '@app/styles/globals.scss'

// STORE
import { StoreContext } from '@app/components/global/context'
import { reducer, initialState } from '@app/components/global/store'


function MyApp({ Component, pageProps }) {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    let n = 12
    
    return (
        <StoreContext.Provider value={{ state, dispatch, n }}>
            <Component {...pageProps} />
        </StoreContext.Provider>
    )
}

export default MyApp
