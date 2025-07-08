import { Center, Text } from '@chakra-ui/react';

const EmptyState = ({ message = 'No data available.' }) => (
  <Center minH="200px">
    <Text color="gray.500">{message}</Text>
  </Center>
);

export default EmptyState; 