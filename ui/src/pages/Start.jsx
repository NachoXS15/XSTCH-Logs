import React from 'react'
import logo from '../assets/xs.png'
import { NavLink } from 'react-router-dom'
import { Nav, Button } from 'react-bootstrap'
export default function Start() {
    return (
        <div className='container bg-dark'>
            <img src={logo} alt="" width={100} />
            <button className='btn btn-primary'>
                <Nav.Link to="/logs" as={NavLink}>Start</Nav.Link>
            </button>
        </div>
    )
}
