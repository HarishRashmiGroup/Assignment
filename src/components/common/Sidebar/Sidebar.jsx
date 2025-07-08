import { Box, VStack, Link } from '@chakra-ui/react';

const Sidebar = () => (
  <Box as="nav" bg="gray.50" w="220px" minH="100vh" p={4} boxShadow="md">
    <VStack align="stretch" spacing={4}>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/expenses">Expenses</Link>
      <Link href="/budget">Budget</Link>
      <Link href="/reports">Reports</Link>
      <Link href="/suggestions">Suggestions</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/admin">Admin</Link>
    </VStack>
  </Box>
);

export default Sidebar; 