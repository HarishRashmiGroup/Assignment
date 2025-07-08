import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Avatar,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Card,
  CardBody,
  HStack,
  Icon,
  Container,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import { FaUserCircle, FaEnvelope, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Container maxW="8xl" py={8} borderRadius="lg">
      <Box bg={bgColor} minH="100vh" p={4}>

        <Heading size="lg" mb={2}>
          My Profile
        </Heading>

        <Card shadow={'none'} bg={bgColor} overflow={'hidden'} borderRadius="lg">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack spacing={4}>
                <Avatar
                  name={user?.name || user?.email}
                  size="xl"
                  icon={<FaUserCircle fontSize="2rem" />}
                />
                <VStack align="start" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold">{user?.name || 'Unnamed User'}</Text>
                  <HStack>
                    <Icon as={FaEnvelope} color="gray.500" />
                    <Text fontSize="sm" color={textColor}>{user?.email}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaUserShield} color="gray.500" />
                    <Badge colorScheme={user?.role === 'admin' ? 'purple' : 'blue'} variant="solid">
                      {user?.role || 'User'}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>
              <VStack align="start" spacing={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="dark-mode" mb="0">
                    Dark Mode
                  </FormLabel>
                  <Switch id="dark-mode" isChecked={darkMode} onClick={()=> setDarkMode(!darkMode)} />
                </FormControl>
              </VStack>
              <Stat>
                <StatLabel color={textColor}>Account Type</StatLabel>
                <StatNumber color="blue.400">
                  {user?.premium ? 'Premium' : 'Free'}
                </StatNumber>
              </Stat>

              <Button
                leftIcon={<FaSignOutAlt />}
                colorScheme="red"
                alignSelf="flex-start"
                onClick={logout}
              >
                Logout
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfileScreen;
