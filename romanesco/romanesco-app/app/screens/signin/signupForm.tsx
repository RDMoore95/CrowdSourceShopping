import React from 'react';
import { Button, TextInput, View } from 'react-native';
import { Formik } from 'formik';

function signUpasync (email: any, first_name: any, last_name: any, password: any, zip_code: any) => {

    try {

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          first_name: first_name,
          last_name: last_name,
          password: password,
          zip_code: zip_code
         })
    };
          fetch('http://flip1.engr.oregonstate.edu:4545/signUp', requestOptions)
            .then(response => response.json)
            .then(json => console.log(json))
            .catch(err => console.log(err))
      } catch (err) {
        console.log(err);
      }
  }

export const signUpForm = props => (
    

    <Formik
        initialValues={{email: '', first_name: '', last_name: '', password: '', zip_code: ''}}
        onSubmit={values => }
        >


        </Formik>

)