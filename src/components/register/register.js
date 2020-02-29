import React, { useState, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../UI/button';

const Register = ({login}) => {   
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            login: '',
            password: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
            .max(15, 'Musi zawierac 15 znaków lub mniej')
            .required('Te pole jest wymagane'),
            lastName: Yup.string()
            .required('Te pole jest wymagane'),
            login: Yup.string()
            .required('Te pole jest wymagane'),
            password: Yup.string()
            .required('Te pole jest wymagane')
        }),
        onSubmit: value => {
            alert(value);
        } 
    })   
    
    return !login && (
            <form onSubmit={formik.handleSubmit} className="login">
                <h1>Załóż Konto</h1>
                <input 
                className="login-input"
                id="firstName" 
                name="firstName" 
                type="text" 
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Imię"
                />
                { formik.touched.firstName && formik.errors.firstName ? (
                    <div style={{color: 'red', padding: "5px"}}>{formik.errors.firstName}</div>
                ) : null}
                <input 
                className="login-input"
                id="lastName" 
                name="lastName" 
                type="text" 
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nazwisko"
                />
                { formik.touched.lastName && formik.errors.lastName ? (
                    <div style={{color: 'red', padding: "5px"}}>{formik.errors.lastName}</div>
                ) : null}
                <input 
                className="login-input"
                id="login" 
                name="login" 
                type="text" 
                value={formik.values.login}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Login"
                />
                { formik.touched.login && formik.errors.login ? (
                    <div style={{color: 'red', padding: "5px"}}>{formik.errors.login}</div>
                ) : null}
                <input 
                className="login-input"
                id="password" 
                name="password" 
                type="password" 
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Hasło"
                />
                { formik.touched.password && formik.errors.password ? (
                    <div style={{color: 'red', padding: "5px"}}>{formik.errors.password}</div>
                ) : null}
                <Button type="submit">Zarejestruj</Button>
            </form>
        )
};

export default Register;