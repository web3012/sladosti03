
import Layout from '@app/components/layout'
import ListPeople from '@app/components/people/list'
import InfoPeople from '@app/components/people/info'

import { useRouter } from 'next/router'
import useSWR from 'swr'
const fetcher = async (url) => {
    const res = await fetch(url)
    const data = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }
    return data
}

export default () => {
    const { query } = useRouter()
    const { data, error } = useSWR(
        () => query.id && `/api/people/${query.id}`,
        fetcher
    )
    
    return (
        <Layout>
            <div className="pageSidebar">
                <div className="_block">
                    <ListPeople />
                </div>
            </div>

            <div className="pageContent">
                {error && <div>{error.message}</div>}
                {!data && <div>Loading...</div>}
                <InfoPeople data={data} />
            </div>
        </Layout>
    )
}