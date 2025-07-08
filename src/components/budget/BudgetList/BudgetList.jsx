import { VStack, Box, Text } from '@chakra-ui/react';

const BudgetList = ({ budgets = [] }) => (
  <VStack spacing={3} align="stretch">
    {budgets.length === 0 ? (
      <Text color="gray.500">No budgets found.</Text>
    ) : (
      budgets.map((budget, idx) => (
        <Box key={idx} p={3} bg="white" boxShadow="sm" borderRadius="md">
          <Text fontWeight="bold">{budget.category}</Text>
          <Text>${budget.amount}</Text>
        </Box>
      ))
    )}
  </VStack>
);

export default BudgetList; 