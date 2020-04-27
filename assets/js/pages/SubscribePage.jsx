import React, {useState} from 'react';
import Field from "../components/forms/Field";
import AuthAPI from "../services/authAPI";
import usersAPI from "../services/usersAPI";

const SubscribePage = ({history}) => {
    const [user, setUser] = useState({
        name: 'tulyp',
        email: 'tulyp@aze.aze',
        password: 'azeqsdaze'
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: ""
    });

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setUser({...user, [name]: value})
    }

    // Gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await usersAPI.create(user)
            setErrors([]);
            // history.replace("/posts")
        } catch (e) {
            console.log(e.response)
        }
    }

    return (<>
        <h1>On crée un profil ici!</h1>
        <form onSubmit={handleSubmit}>
            <Field name="name" label="Votre pseudo" value={user.name} onChange={handleChange} placeholder="pseudo" error={errors.name}/>
            <Field name="email" label="Votre email" value={user.email} onChange={handleChange} placeholder="email de connexion" type="email" error={errors.email}/>
            <Field name="password" label="Votre mot de passe" value={user.password} onChange={handleChange} placeholder="password de connexion" type="password" error={errors.password}/>
            <div className="form-group">
                <button type="submit" className="btn btn-dark">Souscrire</button>
            </div>
        </form>
    </>);
};

export default SubscribePage;
