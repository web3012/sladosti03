import {tablePeople} from './info.module.scss'

export default function InfoPeople({data}) {

    return (
        <table className={tablePeople}>
            <thead>
                <tr>
                    <th>Name1</th>
                    <th>Height</th>
                    <th>Mass</th>
                    <th>Hair color</th>
                    <th>Skin color</th>
                    <th>Eye color</th>
                    <th>Gender</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{data && data.name}</td>
                    <td>{data && data.height}</td>
                    <td>{data && data.mass}</td>
                    <td>{data && data.hair_color}</td>
                    <td>{data && data.skin_color}</td>
                    <td>{data && data.eye_color}</td>
                    <td>{data && data.gender}</td>
                </tr>
            </tbody>
        </table>
    )
}