import Layout from '@app/components/layout'
import Korzina from '@app/components/shop/Korzina'
import Link from 'next/link'

const Catalog = (props) => {

    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    <p>***</p>
                </div>
            </div>

            <div className="pageContent">
                <p>Корзина...</p>

                <Korzina/>

            </div>
        </Layout>
    )
}

export default Catalog
