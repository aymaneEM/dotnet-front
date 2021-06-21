import React, { useState } from 'react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import './Accidents.css';
import { Button } from '@chakra-ui/react';
import { Redirect, useHistory } from 'react-router-dom';

export default function Login({ user }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(true);
  const history = useHistory();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const submit = async e => {
    e.preventDefault();
    await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    }).then(res => {
      if (res?.status === 200) {
        history.go(0);
      } else {
        setSuccess(false);
      }
    });
  };

  if (user?.name) {
    return <Redirect to="/accidents" />;
  }

  return (
    <div className="wrapper2">
      <Formik
        onSubmit={(e, actions) => {
          setTimeout(() => {
            submit(e);
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        <Form>
          <Field name="email">
            {({ field, form }) => (
              <FormControl isInvalid={!success}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  placeholder="Email"
                  style={{ marginBottom: '10px' }}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                />
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    // pr="4.5rem"
                    type={show ? 'text' : 'password'}
                    id="password"
                    placeholder="Password"
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>Invalid credentials</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            className="subsub"
            colorScheme="teal"
            type="submit"
            onClick={submit}
          >
            Login
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
