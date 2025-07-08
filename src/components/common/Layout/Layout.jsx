import { Box, Flex } from '@chakra-ui/react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

const Layout = ({ children }) => (
  <Box minH="100vh">
    <Header />
    <Flex>
      <Sidebar />
      <Box flex="1" p={6} bg="gray.100">
        {children}
      </Box>
    </Flex>
  </Box>
);

export default Layout; 