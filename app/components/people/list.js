import Link from 'next/link'
import useSWR from 'swr'
const fetcher = (url) => fetch(url).then((res) => res.json())

const ListPeoples = () => {
    const { data, error } = useSWR('/api/people', fetcher)

    return (
        <React.Fragment>
            {error && (<div>Error loading</div>)}
            {data && (
                <ul>
                    {data.map((p, i) => (
                        <li key={i}><Link href="/person/[id]" as={`/person/${p.id}`}><a>{p.name}</a></Link></li>
                    ))}
                </ul>
            )}
        </React.Fragment>
    )
}
export default ListPeoples