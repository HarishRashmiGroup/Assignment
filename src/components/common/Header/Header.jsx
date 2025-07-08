import {
  Box, Flex, Heading, IconButton, useDisclosure,
  Stack, Link as ChakraLink, Drawer, DrawerOverlay,
  DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/budget', label: 'Budget' },
  { to: '/smart-bot', label: 'Smart Bot' },
  { to: '/profile', label: 'Profile' },
];

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const isAuthRoute = location.pathname === '/auth';

  const NavLinks = () => (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={6} align={{ base: 'start', md: 'center' }}>
      {navLinks.map(link => (
        <ChakraLink
          as={Link}
          to={link.to}
          key={link.to}
          color={location.pathname === link.to ? 'teal.200' : 'white'}
          _hover={{ color: 'teal.100' }}
        >
          {link.label}
        </ChakraLink>
      ))}
    </Stack>
  );

  if (isAuthRoute) return (<Box as="header" bg="teal.500" color="white" px={4} py={2} boxShadow="md" position="sticky" top={0} zIndex={10}>
    <Flex align="center" justify="space-between">
      <Heading size="md">Personal Finance Tracker+</Heading>
      <Text>Login / SignUp</Text>
    </Flex>
  </Box>);

  return (
    <Box as="header" bg="teal.500" color="white" px={4} py={4} boxShadow="md" position="sticky" top={0} zIndex={10}>
      <Flex align="center" justify="space-between">
        <Heading size="md">Personal Finance Tracker+</Heading>
        <Flex display={{ base: 'none', md: 'flex' }}>
          <NavLinks />
        </Flex>
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="ghost"
          color="white"
          _hover={{ bg: 'teal.600' }}
        />
      </Flex>

      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="teal.500">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white">Menu</DrawerHeader>
          <DrawerBody>
            <NavLinks />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
