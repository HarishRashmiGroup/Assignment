import { VStack, Box, Text } from '@chakra-ui/react';

const RecentExpenses = ({ expenses = [] }) => (
  <VStack spacing={3} align="stretch">
    <Text fontWeight="bold">Recent Expenses</Text>
    {expenses.length === 0 ? (
      <Text color="gray.500">No recent expenses.</Text>
    ) : (
      expenses.map((expense, idx) => (
        <Box key={idx} p={3} bg="white" boxShadow="sm" borderRadius="md">
          <Text>{expense.category}: ${expense.amount}</Text>
        </Box>
      ))
    )}
  </VStack>
);

export default RecentExpenses; 