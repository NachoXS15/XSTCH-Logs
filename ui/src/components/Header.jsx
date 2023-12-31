import React from "react";
import logo from '../assets/xs.png'
import { NavLink } from 'react-router-dom'
import { Nav, Button, Container, Navbar } from "react-bootstrap";
export default function Header(props) {
    return (
        <>
            <Navbar expand="lg" className="bg-dark mb-3 rounded">
                <Container>
                    <div className="d-flex align-items-center">
                        <img src={logo} width={80} />
                    </div>
                    <Navbar.Toggle aria-controls="basic-navbar-nav">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-list" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                        </svg></span>
                    </Navbar.Toggle>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="navbar-nav ms-auto mb-2 mb-lg-0 text-center d-flex align-items-center">
                            <Nav.Link className="text-white" style={{ margin: '0 1.5em 0' }} to="/logs" as={NavLink}>Registros</Nav.Link>
                            <Nav.Link className="text-white" style={{ margin: '0 1.5em 0' }} to="/clients" as={NavLink}>Clients</Nav.Link>
                            <Nav.Link className="text-white" style={{ margin: '0 1.5em 0' }} to="/services" as={NavLink}>Services</Nav.Link>
                            <Nav.Link className="text-white" style={{ margin: '0 1.5em 0' }} to={props.link ? `/services/${props.link}` : `/services/`} as={NavLink}>
                                <Button>{props.name ? `Add ${props.name}` : "Volver"}</Button>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
