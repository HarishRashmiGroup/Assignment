// components/LoginScreen.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { login, signup, getUser } from '../../services/api/authApi';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    passkey: '',
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setForm({ name: '', email: '', passkey: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let response;

      if (isLogin) {
        response = await login(form.email, form.passkey);
      } else {
        response = await signup(form.name, form.email, form.passkey);
      }

      localStorage.setItem('token', response.token);
      toast({ title: `${isLogin ? 'Login' : 'Signup'} successful!`, status: 'success' });
      const user = await getUser();
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast({ title: err.message || 'Error', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center">
        {isLogin ? 'Login' : 'Sign Up'}
      </Heading>
      <VStack spacing={4}>
        {!isLogin && (
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </FormControl>
        )}
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="passkey"
            type="password"
            value={form.passkey}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width="full"
          isLoading={loading}
          onClick={handleSubmit}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
        <Text
          color="blue.500"
          fontWeight="medium"
          cursor="pointer"
          onClick={toggleForm}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginScreen;
