import React, {useContext, useState} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";

const LoginPage = ({history}) => {
    const {setIsAuthenticated} = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: 'aze@aze.aze',
        password: 'azeazeaze'
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
            toast.success('🦄Connexion réussi !');
            history.replace("/posts")
        } catch (e) {
            setError(e.response.data.message)
            toast.error("Erreur de connexion")
        }
    }

    return (<>
        <h1>Connexion !!</h1>
        <form onSubmit={handleSubmit}>
            <Field name="username" label="Votre email" value={credentials.username} onChange={handleChange} placeholder="email de connexion" type="email" error={error}/>
            <Field name="password" label="Votre mot de passe" value={credentials.password} onChange={handleChange} placeholder="password de connexion" type="password" error={error}/>
            <div className="form-group">
                <button type="submit" className="btn btn-dark">Connexion</button>
            </div>
        </form>
    </>);
}

export default LoginPage;
