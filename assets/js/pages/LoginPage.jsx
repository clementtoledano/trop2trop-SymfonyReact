import React, {useContext, useState} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({history}) => {
    const {setIsAuthenticated} = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: 'aze@aze.aze',
        password: 'azeqsdaze'
    });

    const [error, setError] = useState("");

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value})
    }

    // Gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials)
            setError("");
            setIsAuthenticated(true)
            history.replace("/posts")
        } catch (e) {
            setError(e.response.data.message)
        }
    }

    return (<>
        <h1>Connexion !!</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">email</label>
                <input
                    id={"username"}
                    onChange={handleChange}
                    value={credentials.username}
                    type="email"
                    placeholder="email de connexion"
                    className={"form-control" + (error && " is-invalid")}
                    name="username"
                />
                {error && <p className={"invalid-feedback"}>{error}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="password">mot de passe</label>
                <input
                    id={"password"}
                    onChange={handleChange}
                    value={credentials.password}
                    type="password"
                    placeholder={"password de connexion"}
                    className="form-control"
                    name="password"
                />
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-dark">Connexion</button>
            </div>
        </form>
    </>);
}

export default LoginPage;
