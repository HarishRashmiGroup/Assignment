import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin({ email, password });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} bg="white" boxShadow="md" borderRadius="md">
      <VStack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </FormControl>
        <Button colorScheme="teal" type="submit" w="full">Login</Button>
      </VStack>
    </Box>
  );
};

export default LoginForm; 