import React, { useEffect, useState } from "react"

const Korzina = (props) => {

    const [init, setInit] = useState(false)
    const [items, setItems] = useState([])

    useEffect(() => {
        if (!init) {
            let a = JSON.parse(window.localStorage.getItem('zakaz')) || []
            setItems(a)
            setInit(true)
        }
    })

    return (
        <div style={{ margin: "20px 0" }}>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Количество</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(elem => {
                        if (elem.count) {
                            return (
                                <tr key={elem.id}>
                                    <td >{elem.id}</td>
                                    <td style={{ width: "200px" }}>{elem.count}</td>
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Korzina