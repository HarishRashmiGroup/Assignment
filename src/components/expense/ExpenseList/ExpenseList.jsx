import { VStack, Box, Text } from '@chakra-ui/react';

const ExpenseList = ({ expenses = [] }) => (
  <VStack spacing={3} align="stretch">
    {expenses.length === 0 ? (
      <Text color="gray.500">No expenses found.</Text>
    ) : (
      expenses.map((expense, idx) => (
        <Box key={idx} p={3} bg="white" boxShadow="sm" borderRadius="md">
          <Text fontWeight="bold">{expense.category}</Text>
          <Text>${expense.amount}</Text>
          <Text fontSize="sm" color="gray.500">{expense.note}</Text>
        </Box>
      ))
    )}
  </VStack>
);

export default ExpenseList; 