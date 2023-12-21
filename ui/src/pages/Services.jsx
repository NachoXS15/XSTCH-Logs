import React, { useEffect } from 'react'
import Header from '../components/Header'
import axios from 'axios'

const BASE_URI = "http://localhost:3000/services/"

function Services() {
    const [services, setServices] = useState([])
    useEffect(() => {
        getServices()
    }, [])

    const getServices = async () => {
        try {
            const res = await axios.get(BASE_URI);
            setServices(res.data)
        } catch (error) {
            console.log("error al traer servicios: ", error.message)
        }
    }

    return (
        <>
            <Header />
            <div>
                <table border={1} className='w-100'>
                    <tr>
                        <th>Id</th>
                        <th>Cliente</th>
                    </tr>
                    {clients.map((client) => {
                        return (
                            <tr key={client.id}>
                                <td>{client.id_cliente}</td>
                                <td>{client.nombre_cliente}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </>
    )
}

export default Services