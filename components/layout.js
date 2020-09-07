import React from "react"

import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import CallIcon from '@material-ui/icons/Call'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import MapIcon from '@material-ui/icons/Map'
import EmailIcon from '@material-ui/icons/Email'
import Head from 'next/head'
import KorzinaCount from './shop/korzinaCount'

const Layout = (props) => {

    let { children } = props

    let [init, setInit] = React.useState(false)

    React.useEffect(() => {
        if (!init) {

        }
        setInit(true)
    }, [])

    return (
        <div className="pageWrapper">
            <CssBaseline />
            <Head>
                <title>Сладости 03</title>
            </Head>

            <div className="lineTopline">
                <Container maxWidth="md" className="pageTopline">
                    <Grid container spacing={1} direction="row" justify="center" alignItems="center">
                        <Grid item md={6} className="_left">
                            <a href="/" className="_t"><CallIcon />&nbsp;Контакты</a>&nbsp;/&nbsp;<a href="/" className="_t">Доставка и оплата</a>
                        </Grid>

                        <Grid item md={6} className="_right">
                            &nbsp;/&nbsp;<a href="/"><WhatsAppIcon /> WHATSAPP</a>&nbsp;/&nbsp;<a href="/contacts" title="Все контакты"><CallIcon /> +7 (924) 456-74-01</a>
                                &nbsp;/&nbsp;<KorzinaCount />
                        </Grid>
                    </Grid>
                </Container>
            </div>

            <Container maxWidth="md" className="pageMiddle">

                <header className="pageHeader">
                    <a href="/" className="logotip"><h1>Сладости03</h1></a>
                </header>
                <div className="pageMenu">
                    <ul className="menu1">
                        <li><a href="/">Печенье</a></li>
                        <li><a href="/">Вафли</a></li>
                        <li><a href="/">Пряники</a></li>
                        <li><a href="/">Конфеты</a></li>
                        <li><a href="/">Карамель</a></li>
                        <li><a href="/">Новинки</a></li>
                        <li><a href="/">Скидки</a></li>
                    </ul>
                </div>


                <div className="pageMain">
                    {children}

                </div>

                <div className="pageFooter">
                    <div className="_txt">
                        <p>&copy; 2020<br />Сладости 03.<br />Все права защищены.</p>
                        <p>
                            <MapIcon /> г. Улан-Удэ, ул. Гоголя, д.53<br />
                            <CallIcon /> +7 (924) 456-74-01
                        </p>
                        <p>
                            <EmailIcon /> <a href="mailto:info@dianmed.ru">info@dianmed.ru</a>
                        </p>
                    </div>
                </div>

            </Container>

        </div>
    )
}

export default Layout

