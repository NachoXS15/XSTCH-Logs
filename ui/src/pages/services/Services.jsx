import React, { useEffect, useState} from 'react'
import Header from '../../components/Header'
import axios from 'axios'

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

    return (
        <>
            <Header create="service" />
            <div>
                <table border={1} className='w-100'>
                    <tr>
                        <th>Id</th>
                        <th>Servicio</th>
                    </tr>
                    {services.map((service) => {
                        return (
                            <tr key={service.id}>
                                <td>{service.id_servicio}</td>
                                <td>{service.nombre_servicio}</td>
                                <td><button>Eliminar</button></td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </>
    )
}

export default Services