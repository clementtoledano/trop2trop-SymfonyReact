import React, {useState} from 'react';
import Field from "../components/forms/Field";
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";

const SubscribePage = ({history}) => {
        const [user, setUser] = useState({
            name: '',
            email: '',
            password: '',
            retypedPassword: ''
        });

        const [errors, setErrors] = useState({
            name: "",
            email: "",
            password: "",
            retypedPassword: ""
        });

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setUser({...user, [name]: value})
    }


    // Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            setErrors({});
            await usersAPI.create(user)
            toast.success('🦄Compte créé ! Vous avez reçu un email de validation');
            history.replace("/posts")
        } catch (e) {
            toast.error("Erreur pendant la création")
            if (e.response.data.violations) {
                const apiErrors = {};
                e.response.data.violations.map(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors)

            }
        }
    }

    return (<>
        <h1>Rejoint les troupes !</h1>
        <form onSubmit={handleSubmit}>
            <Field name="name" label="Pseudo" value={user.name} onChange={handleChange} placeholder="pseudo" error={errors.name}/>
            <Field name="email" label="Email" value={user.email} onChange={handleChange} placeholder="email de connexion" type="email" error={errors.email}/>
            <Field name="password" label="Mot de passe" value={user.password} onChange={handleChange} placeholder="mot de passe" type="password" error={errors.password}/>
            <span>minimum 8 caractères, une majuscule et un chiffre</span>
            <Field name="retypedPassword" label="Confirmer le mot de passe" value={user.retypedPassword} onChange={handleChange} placeholder="mot de passe" type="password" error={errors.retypedPassword}/>
            <div className="form-group">
                <button type="submit" className="btn btn-dark">Souscrire</button>
            </div>
        </form>
        <p>En vous inscrivant, vous acceptez notre <a href="#">Politique de confidentialité</a> et notamment notre <a href="#">Politique de cookies</a>.</p>
        <NavLink to="/login">Vous possédez déjà un compte ?</NavLink>
    </>);
};

export default SubscribePage;
