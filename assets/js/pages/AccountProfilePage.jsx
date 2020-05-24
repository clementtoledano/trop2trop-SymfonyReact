import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import UserAPI from "../services/usersAPI";
import {toast} from "react-toastify";
import AuthApi from "../services/authAPI";

const AccountProfilePage = () => {

    const [user, setUser] = useState({
        name: '',
        email: ''
    });

    const [password, setPassword] = useState({
        old: '',
        new: '',
        reNew:''
    });

    const userId = JSON.parse(localStorage.getItem('currentUser')).id

    useEffect(() => {

        UserAPI.findById(userId).then(r => {
            setUser({name: r.name, email: r.email})
        })
    }, [])


    const [errors, setErrors] = useState({
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        newRetypedPassword: ""
    });

    // Gestion des champs
    const handleUser = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setUser({...user, [name]: value})
    }
    const handlePassword = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setPassword({...password, [name]: value})
    }


// Gestion des champs
    const handleUserSubmit = async event => {
        event.preventDefault();
        try {
            setErrors({});
            await UserAPI.update(user, userId)
            //TODO modifier le currentUser
            toast.success('🦄Profil mis a jour !');
        } catch (e) {
            // toast.error("Erreur pendant l'édition")
            if (e.response.data.violations) {
                const apiErrors = {};
                e.response.data.violations.map(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors)
            }
        }
    }

// Gestion des champs
    const handlePasswordSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});
            await UserAPI.updatePassword({
                'oldPassword': password.old,
                'newPassword': password.new,
                'newRetypedPassword': password.reNew
            }, userId)
            AuthApi.logout()
            toast.success('🦄Mot de passe modifié, veuillez vous reloger !');
        } catch (e) {
            if (e.response.data.violations) {
                const apiErrors = {};
                e.response.data.violations.map(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors)
            }
            // toast.error("Erreur pendant l'édition")
        }
    }

    return (<>
        <h1>Ici on gere son profil!</h1>
        <div className="jumbotron">
            <form onSubmit={handleUserSubmit}>
                <Field name="name" label="Pseudo" value={user.name} onChange={handleUser} placeholder="pseudo" error={errors.name}/>
                <Field name="email" label="Email" value={user.email} onChange={handleUser} placeholder="email de connexion" type="email" error={errors.email}/>
                <div className="form-group">
                    <button type="submit" className="btn btn-dark">mettre a jour</button>
                </div>
            </form>
        </div>
        <div className="jumbotron">
            <form onSubmit={handlePasswordSubmit}>
                <Field name="old" label="ancien password" value={password.old} onChange={handlePassword} placeholder="mot de passe" type="password" error={errors.oldPassword}/>
                <Field name="new" label="nouveau password" value={password.new} onChange={handlePassword} placeholder="mot de passe" type="password" error={errors.newPassword}/>
                <Field name="reNew" label="re nouveau password" value={password.reNew} onChange={handlePassword} placeholder="mot de passe" type="password" error={errors.newRetypedPassword}/>
                <div className="form-group">
                    <button type="submit" className="btn btn-dark">mettre a jour</button>
                </div>
            </form>
        </div>
    </>);
};


export default AccountProfilePage;
