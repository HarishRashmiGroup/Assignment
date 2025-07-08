import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const BudgetAlert = ({ message = 'Budget exceeded!', status = 'error' }) => (
  <Alert status={status} borderRadius="md" mb={4}>
    <AlertIcon />
    <AlertTitle mr={2}>{message}</AlertTitle>
    <AlertDescription></AlertDescription>
  </Alert>
);

export default BudgetAlert; 