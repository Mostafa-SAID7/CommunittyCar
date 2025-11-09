import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, FormGroup, Label, Input, Alert, Spinner } from 'reactstrap';
import { login, clearError } from '../../store/slices/authSlice';

const LoginForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="login-form">
      <h2 className="text-center mb-4">Login to CommunityCar</h2>

      {error && (
        <Alert color="danger" toggle={handleClearError}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{
          email: '',
          password: '',
          rememberMe: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Field
                as={Input}
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                invalid={!!error}
              />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Field
                as={Input}
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                invalid={!!error}
              />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Field
                  as={Input}
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                />
                Remember me
              </Label>
            </FormGroup>

            <Button
              type="submit"
              color="primary"
              block
              disabled={loading}
              className="mt-3"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Form>
        )}
      </Formik>

      <div className="text-center mt-3">
        <a href="/register" className="text-decoration-none">
          Don't have an account? Register here
        </a>
      </div>
    </div>
  );
};

export default LoginForm;