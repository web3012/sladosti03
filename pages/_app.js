import '../styles/globals.scss'

// STORE
import { StoreContext } from '../components/global/context'
import { reducer, initialState } from '../components/global/store'


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
