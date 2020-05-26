import React, {useContext, useState} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";
import ButtonCustom from "../components/forms/ButtonCustom";

const LoginPage = ({history}) => {
    const {setIsAuthenticated} = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [loaded, setLoaded] = useState(false)

    const [error, setError] = useState("");

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value})
    }

    // Gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoaded(true)
        try {
            await AuthAPI.authenticate(credentials)
            setError("");
            setIsAuthenticated(true)
            toast.success('🦄Connexion réussi !');
            setTimeout(() => {
            history.replace("/posts")
            }, 2000)

        } catch (e) {
            setError(e.response.data.message)
            // toast.error("Erreur de connexion")
            setLoaded(false)

        }
    }

    return (<>
        <h1>Une envie de Trop-de-trop ?</h1>

        <p className="jumbotron">admin : <br/> mail : admin@admin.admin <br/> mdp : adminadmin</p>

        <form onSubmit={handleSubmit}>
            <Field name="username" label="Votre email" value={credentials.username} onChange={handleChange} placeholder="email de connexion" type="email" error={error}/>
            <Field name="password" label="Votre mot de passe" value={credentials.password} onChange={handleChange} placeholder="password de connexion" type="password" error={error}/>

            <ButtonCustom loaded={loaded} text={"Connexion"}/>

        </form>
        <br/>
        <NavLink to="#">Mot de passe oublié ?</NavLink><br/>
        <NavLink to="/subscribe">Pas de compte ? Créez votre compte.</NavLink>
    </>);
}

export default LoginPage;
