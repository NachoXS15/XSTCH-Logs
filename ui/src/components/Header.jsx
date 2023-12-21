import React from "react";
import logo from '../assets/xs.png'
import { NavLink } from 'react-router-dom'
import { Nav, Button } from "react-bootstrap";
export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg bg-dark rounded d-flex justify-content-evenly">
            <div className="container" >
                <a className="navbar-brand" href="#"><img src={logo} alt="" width={80} /></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#togglerHeader" aria-controls="togglerHeader" aria-expanded="true" aria-label="Toggle navigation">
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                    </svg></span>
                </button>
            </div>
            <div className="collapse navbar-collapse" id="togglerHeader">
                <Nav.Link className="text-white" style={{margin: '0 1.5em 0'}} to="/logs" as={NavLink}>Registros</Nav.Link>
                <Nav.Link className="text-white" style={{margin: '0 1.5em 0'}} to="/clients" as={NavLink}>Clients</Nav.Link>
                <Nav.Link className="text-white" style={{margin: '0 1.5em 0'}} to="/services" as={NavLink}>Services</Nav.Link>
                <Nav.Link className="text-white" style={{margin: '0 1.5em 0'}} to="/create" as={NavLink}>
                    <Button className="">Create</Button>
                </Nav.Link>
            </div>
        </nav>
    );
}
