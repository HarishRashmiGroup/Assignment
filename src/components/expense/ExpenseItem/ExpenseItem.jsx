import { Box, Text } from '@chakra-ui/react';

const ExpenseItem = ({ expense }) => (
  <Box p={3} bg="white" boxShadow="sm" borderRadius="md">
    <Text fontWeight="bold">{expense.category}</Text>
    <Text>${expense.amount}</Text>
    <Text fontSize="sm" color="gray.500">{expense.note}</Text>
  </Box>
);

export default ExpenseItem; 