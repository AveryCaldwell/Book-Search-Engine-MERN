import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

// Replace the createUser function call inside handleFormSubmit with a call to the addUser mutation function returned from useMutation.
// import { createUser } from '../utils/API';

const SignupForm = () => {
    // set initial form state
    const [userFormData, setUserFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    // set state for form validation
    const [validated] = useState(false);
    // set state for alert
    const [showAlert, setShowAlert] = useState(false);
    // define error state variable
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };
    const [addUser] = useMutation(ADD_USER);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // check if form has everything (as per react-bootstrap docs)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        // replace
        // try {
        // const response = await createUser(userFormData);
        //     if (!response.ok) {
        //         throw new Error('something went wrong!');
        //     }

        //     const { token, user } = await response.json();
        //     console.log(user);
        //     Auth.login(token);
        // } catch (err) {
        //     console.error(err);
        //     setShowAlert(true);
        // }
        try {
            const { data } = await addUser({
                variables: userFormData,
            });
            Auth.login(data.addUser.token);
            setShowAlert(false);
            setError('');
            setUserFormData({
                username: '',
                email: '',
                password: '',
            });
            // try {
            //     const [addUser, { error }] = useMutation(ADD_USER);
            //     const { username, email, password } = userFormData;
            //     const { data } = await addUser({
            //         variables: { username, email, password },
            //     });
            // Auth.login(data.addUser.token);
        } catch (err) {
            console.error(err);
            setShowAlert(true);
            setError('Something went wrong!');
        }
    };

    return (
        <>
            {/* This is needed for the validation functionality above */}
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                {/* REPLACE */}
                {/* <Alert
                    dismissible
                    onClose={() => setShowAlert(false)}
                    show={showAlert}
                    variant='danger'
                > 
                                
                    Something went wrong with your signup!
                </Alert>  */}
                {/* show alert if server response is bad */}
                {error && (
                    <Alert
                        dismissible
                        onClose={() => setShowAlert(false)}
                        show={showAlert}
                        variant='danger'
                    >
                        {error}
                    </Alert>
                )}

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='username'>Username</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Your username'
                        name='username'
                        onChange={handleInputChange}
                        value={userFormData.username}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>
                        Username is required!
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Your email address'
                        name='email'
                        onChange={handleInputChange}
                        value={userFormData.email}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>
                        Email is required!
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Your password'
                        name='password'
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>
                        Password is required!
                    </Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={
                        !(
                            userFormData.username &&
                            userFormData.email &&
                            userFormData.password
                        )
                    }
                    type='submit'
                    variant='success'
                >
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default SignupForm;
