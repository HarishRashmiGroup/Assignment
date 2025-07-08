import { Box, Progress, Text } from '@chakra-ui/react';

const BudgetProgress = ({ value = 0, max = 100 }) => (
  <Box mb={4}>
    <Text mb={2}>Budget Usage</Text>
    <Progress value={value} max={max} colorScheme="teal" borderRadius="md" />
    <Text fontSize="sm" color="gray.500">{value} / {max}</Text>
  </Box>
);

export default BudgetProgress; 