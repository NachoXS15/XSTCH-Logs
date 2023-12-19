import React, { useEffect, useState } from 'react'
import axios from 'axios';
const BASE_URI = "http://localhost:3000/logs/"
export default function Logs() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        getLogs()
    }, [])

    const getLogs = async () => {
        try {
            const res = await axios.get(BASE_URI);
            setLogs(res.data);
            console.log(res.data)
        } catch (error) {
            console.log("error al traer logs: ", error.message)
            console.log(error.response)
        }
    }

    return (
        <>
            <div>
                <table border={1}>
                    <tr>
                        <th>ID</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Pago</th>
                    </tr>
                    {logs.map((log) => {
                        return(
                            <tr key={log.id}>
                                <td>{log.id_cliente}</td>
                                <td>{log.precio}</td>
                                <td>{log.estado}</td>
                                <td>{log.pago}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </>
    )
}
