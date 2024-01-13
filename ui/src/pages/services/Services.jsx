import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const BASE_URI = "http://localhost:3000/services/"

function Services(props) {
    const [services, setServices] = useState([])
    useEffect(() => {
        getServices()
    }, [])

    const getServices = async (res) => {
        try {
            const res = await axios.get(BASE_URI);
            setServices(res.data)
            console.log(res.data)
        } catch (error) {
            console.log("error al traer servicios: ", error.message)
        }
    }

    const deleteService = async(id) => {
        try {
            await axios.delete(`${BASE_URI}${id}`);
            getServices()
            console.log("Eliminado");
        } catch (error) {
            console.error("Error al eliminar", error.message)
        }
    }

    return (
        <>
            <Header link="serviceCreate" name="servicio" path="services" />
            <div>
                <table border={1} className='w-100'>
                    <tr>
                        <th>Id</th>
                        <th>Servicio</th>
                        <th>Fecha de creación</th>
                    </tr>
                    {services.map((service) => {
                        return (
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td>{service.nombre_servicio}</td>
                                <td>{service.createdAt}</td>
                                <td><Button size="sm" to={`/services/editService/${service.id}`} as={NavLink} className='buttonMain'>Actualizar</Button></td>
                                <td><Button size="sm" className='btn btn-danger' onClick={() => deleteService(service.id)}>Eliminar</Button></td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </>
    )
}

export default Services