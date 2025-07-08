import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

const DashboardStats = ({ stats = [] }) => (
  <SimpleGrid columns={stats.length || 1} spacing={4} mb={4}>
    {stats.map((stat, idx) => (
      <Stat key={idx} p={4} bg="white" borderRadius="md" boxShadow="sm">
        <StatLabel>{stat.label}</StatLabel>
        <StatNumber>{stat.value}</StatNumber>
        <StatHelpText>{stat.helpText}</StatHelpText>
      </Stat>
    ))}
  </SimpleGrid>
);

export default DashboardStats; 