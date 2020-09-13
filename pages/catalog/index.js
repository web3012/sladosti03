//import Link from 'next/link'
import Layout from '../../components/layout'
import { readXML } from '@api/catalog/readXML'

const Catalog = ({msg, result}) => {

    console.log("msg", msg)
    console.log("result", result)

    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    ***
                </div>
            </div>

            <div className="pageContent">
                <p>Каталог...</p>
            </div>
        </Layout>
    )
}

export async function getStaticProps(context) {
    const data = await readXML("./public/1cbitrix/offers.xml", "КоммерческаяИнформация-ПакетПредложений-Предложения-Предложение")
    
    console.log("@@@@", data.msg)    
    console.log("@@@@", data.result)
    
    return {
        props: {
            result: data.result,
            a: [1,2,3,4],
            msg: data.msg
        }
    }
}

export default Catalog