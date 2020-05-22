import React, {useContext} from 'react';
import AuthApi from "../services/authAPI";
import {NavLink} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)
    const handleLogout = () => {
        AuthApi.logout();
        setIsAuthenticated(false);
        history.push("/posts");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <NavLink className="navbar-brand" to="/">TROP DE TROP</NavLink>
            <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">les Posts</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/post-edit/new">Écrire un Post</NavLink>
                    </li>

                    {!isAuthenticated &&
                    (<>
                        <li className="nav-item"><NavLink className="btn btn-success" to="/login">Connexion</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/subscribe">Inscription</NavLink></li>
                    </>)
                    ||
                    (<>
                        <li className="nav-item"><a className="btn btn-danger" onClick={handleLogout}>Déconnexion</a></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/account-profile">Mon profil</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/account-posts">Mes posts</NavLink></li>
                    </>)
                    }

                </ul>
            </div>
        </nav>
    );
};

export default React.memo(Navbar);
