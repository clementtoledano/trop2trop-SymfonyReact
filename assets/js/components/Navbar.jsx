import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

            <a className="navbar-brand" href="/#/">TROP 2 TROP</a>
            <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="text" placeholder="Search"/>
                <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                {/*<span className="navbar-toggler-icon"></span>*/}
            </button>
            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/#/posts">les Posts</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Ecrire un Post</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Inscription</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Connexion</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Déconnexion</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
