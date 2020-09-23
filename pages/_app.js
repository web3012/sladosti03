import '@app/styles/globals.scss'

// STORE
import { StoreContext } from '@app/components/global/context'
import { reducer, initialState } from '@app/components/global/store'


function MyApp({ Component, pageProps }) {
    const [state, dispatch] = React.useReducer(reducer, initialState)


    //console.log("_app.js > pageProps > ", pageProps)
    

    return (
        <StoreContext.Provider value={{ dispatch, state }}>
            <Component {...pageProps} />
        </StoreContext.Provider>
    )
}

export default MyApp
