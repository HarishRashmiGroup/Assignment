import { Box, Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid } from '@chakra-ui/react';

const ExpenseStats = ({ total = 0, count = 0 }) => (
  <SimpleGrid columns={2} spacing={4} mb={4}>
    <Stat>
      <StatLabel>Total Expenses</StatLabel>
      <StatNumber>${total}</StatNumber>
      <StatHelpText>This month</StatHelpText>
    </Stat>
    <Stat>
      <StatLabel>Transactions</StatLabel>
      <StatNumber>{count}</StatNumber>
      <StatHelpText>This month</StatHelpText>
    </Stat>
  </SimpleGrid>
);

export default ExpenseStats; 