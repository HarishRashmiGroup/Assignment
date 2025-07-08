import { Center, Spinner } from '@chakra-ui/react';

const LoadingSpinner = () => (
  <Center minH="200px">
    <Spinner size="xl" color="teal.500" thickness="4px" speed="0.65s" />
  </Center>
);

export default LoadingSpinner; 