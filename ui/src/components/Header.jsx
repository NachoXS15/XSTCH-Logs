import React from "react";
import logo from '../assets/xs.png'
export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg bg-dark rounded">
            <div className="container">
                <a className="navbar-brand" href="#"><img src={logo} alt="" width={80} /></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#togglerHeader" aria-controls="togglerHeader" aria-expanded="false" aria-label="Toggle navigation">
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                    </svg></span>
                </button>
                <div className="collapse navbar-collapse" id="togglerHeader">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active text-light" aria-current="page" href="#">Clientes</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#">Servicios</a>
                        </li>
                    </ul>
                </div>
             </div>   
        </nav>
    );
}
