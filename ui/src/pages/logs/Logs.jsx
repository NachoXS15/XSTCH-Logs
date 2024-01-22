import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button } from 'react-bootstrap'
import Header from '../../components/Header';
import { NavLink } from 'react-router-dom';

const BASE_URI = "http://localhost:3000/logs/"

export default function Logs(props) {
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

    const deleteLog = async(id) => {
        try {
            await axios.delete(`${BASE_URI}${id}`);
            getLogs()
            console.log("Eliminado");
        } catch (error) {
            console.error("Error al eliminar", error.message)
        }
    }

    return (
        <>
            <Header link="createLog" name="registro" path="logs" />
            <div>
                <table border={1} className='w-100'>
                    <tr>
                        <th>Cliente</th>
                        <th>Servicio</th>
                        <th>Precio</th>
                        <th>Egreso</th>
                        <th>Estado</th>
                        <th>Pago</th>
                    </tr>
                    {logs.map((log) => {
                        return (
                            <tr key={log.id}>
                                <td>{log.nombre_cliente}</td>
                                <td>{log.nombre_servicio}</td>
                                <td>${log.precio}</td>
                                <td>{log.egreso}</td>
                                <td>{log.estado}</td>
                                <td>{log.pago}</td>
                                <td><Button size="sm" className='buttonMain' to={`/logs/editLog/${log.id}`} as={NavLink}>Actualizar</Button></td>
                                <td><Button size="sm" className='btn btn-danger' onClick={() => deleteLog(log.id)}>Eliminar</Button></td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </>
    )
}
