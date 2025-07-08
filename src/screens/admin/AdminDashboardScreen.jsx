import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Heading,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Badge,
  Flex,
  Button,
  Skeleton,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Progress,
  Divider,
  Tag,
  TagLabel,
  TagLeftIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';
import {
  FaUsers,
  FaChartLine,
  FaTrendingUp,
  FaTrendingDown,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaUtensils,
  FaCar,
  FaShoppingBag,
  FaLightbulb,
  FaGamepad,
  FaHeart,
  FaGraduationCap,
  FaBox,
  FaWallet,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaCrown,
  FaCalendar,
  FaRupeeSign,
  FaChevronDown,
  FaSort,
  FaUserPlus,
  FaPercentage,
  FaMoneyBillWave,
  FaBuilding,
  FaGlobe
} from 'react-icons/fa';
import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://bit.ly/dan-abramov',
    joinDate: '2024-01-15',
    lastActive: '2024-07-07',
    totalExpenses: 125000,
    monthlyExpenses: 15000,
    expenseCount: 234,
    avgExpense: 534,
    topCategory: 'food',
    status: 'active',
    premiumUser: true,
    growthRate: 12.5,
    location: 'Mumbai, India',
    categories: {
      food: 45000,
      transport: 25000,
      shopping: 30000,
      bills: 15000,
      entertainment: 10000
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://bit.ly/sage-adebayo',
    joinDate: '2024-02-20',
    lastActive: '2024-07-06',
    totalExpenses: 89000,
    monthlyExpenses: 12000,
    expenseCount: 187,
    avgExpense: 476,
    topCategory: 'shopping',
    status: 'active',
    premiumUser: false,
    growthRate: -5.2,
    location: 'Delhi, India',
    categories: {
      food: 20000,
      transport: 15000,
      shopping: 35000,
      bills: 12000,
      entertainment: 7000
    }
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://bit.ly/ryan-florence',
    joinDate: '2024-03-10',
    lastActive: '2024-07-05',
    totalExpenses: 156000,
    monthlyExpenses: 18000,
    expenseCount: 298,
    avgExpense: 523,
    topCategory: 'transport',
    status: 'inactive',
    premiumUser: true,
    growthRate: 8.7,
    location: 'Bangalore, India',
    categories: {
      food: 35000,
      transport: 55000,
      shopping: 25000,
      bills: 25000,
      entertainment: 16000
    }
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://bit.ly/kent-c-dodds',
    joinDate: '2024-04-05',
    lastActive: '2024-07-07',
    totalExpenses: 67000,
    monthlyExpenses: 9000,
    expenseCount: 145,
    avgExpense: 462,
    topCategory: 'bills',
    status: 'active',
    premiumUser: false,
    growthRate: 15.3,
    location: 'Chennai, India',
    categories: {
      food: 15000,
      transport: 10000,
      shopping: 12000,
      bills: 20000,
      entertainment: 10000
    }
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'https://bit.ly/prosper-baba',
    joinDate: '2024-05-12',
    lastActive: '2024-07-03',
    totalExpenses: 98000,
    monthlyExpenses: 14000,
    expenseCount: 203,
    avgExpense: 482,
    topCategory: 'entertainment',
    status: 'active',
    premiumUser: true,
    growthRate: -2.1,
    location: 'Kolkata, India',
    categories: {
      food: 22000,
      transport: 18000,
      shopping: 20000,
      bills: 18000,
      entertainment: 20000
    }
  }
];

const categories = [
  { value: 'food', label: 'Food & Dining', icon: FaUtensils, color: 'orange' },
  { value: 'transport', label: 'Transportation', icon: FaCar, color: 'blue' },
  { value: 'shopping', label: 'Shopping', icon: FaShoppingBag, color: 'purple' },
  { value: 'bills', label: 'Bills & Utilities', icon: FaLightbulb, color: 'yellow' },
  { value: 'entertainment', label: 'Entertainment', icon: FaGamepad, color: 'green' },
  { value: 'health', label: 'Health & Medical', icon: FaHeart, color: 'red' },
  { value: 'education', label: 'Education', icon: FaGraduationCap, color: 'teal' },
  { value: 'others', label: 'Others', icon: FaBox, color: 'gray' }
];

const UserDetailModal = ({ user, isOpen, onClose }) => {
  const getCategoryInfo = (value) => categories.find(c => c.value === value) || categories[categories.length - 1];

  const categoryData = Object.entries(user?.categories || {}).map(([key, value]) => ({
    name: getCategoryInfo(key).label,
    value: value,
    color: getCategoryInfo(key).color
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Avatar src={user?.avatar} name={user?.name} />
            <VStack align="start" spacing={0}>
              <Text fontSize="xl" fontWeight="bold">{user?.name}</Text>
              <Text fontSize="sm" color="gray.500">{user?.email}</Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Categories</Tab>
              <Tab>Activity</Tab>
              <Tab>Settings</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
                  <Stat>
                    <StatLabel>Total Expenses</StatLabel>
                    <StatNumber color="blue.500">₹{user?.totalExpenses?.toLocaleString()}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Monthly Expenses</StatLabel>
                    <StatNumber color="green.500">₹{user?.monthlyExpenses?.toLocaleString()}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Expense Count</StatLabel>
                    <StatNumber color="purple.500">{user?.expenseCount}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Average Expense</StatLabel>
                    <StatNumber color="orange.500">₹{user?.avgExpense}</StatNumber>
                  </Stat>
                </SimpleGrid>

                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem>
                    <Box p={4} bg="gray.50" borderRadius="md">
                      <Text fontWeight="bold" mb={2}>Account Details</Text>
                      <VStack align="start" spacing={2}>
                        <Text fontSize="sm"><strong>Join Date:</strong> {user?.joinDate}</Text>
                        <Text fontSize="sm"><strong>Last Active:</strong> {user?.lastActive}</Text>
                        <Text fontSize="sm"><strong>Location:</strong> {user?.location}</Text>
                        <Text fontSize="sm"><strong>Status:</strong>
                          <Badge ml={2} colorScheme={user?.status === 'active' ? 'green' : 'red'}>
                            {user?.status}
                          </Badge>
                        </Text>
                      </VStack>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box p={4} bg="gray.50" borderRadius="md">
                      <Text fontWeight="bold" mb={2}>Financial Summary</Text>
                      <VStack align="start" spacing={2}>
                        <Text fontSize="sm"><strong>Top Category:</strong> {getCategoryInfo(user?.topCategory).label}</Text>
                        <Text fontSize="sm"><strong>Growth Rate:</strong>
                          <Badge ml={2} colorScheme={user?.growthRate >= 0 ? 'red' : 'green'}>
                            {user?.growthRate >= 0 ? '+' : ''}{user?.growthRate}%
                          </Badge>
                        </Text>
                        <Text fontSize="sm"><strong>Premium User:</strong>
                          <Badge ml={2} colorScheme={user?.premiumUser ? 'gold' : 'gray'}>
                            {user?.premiumUser ? 'Yes' : 'No'}
                          </Badge>
                        </Text>
                      </VStack>
                    </Box>
                  </GridItem>
                </Grid>
              </TabPanel>

              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <Text fontWeight="bold" mb={4}>Category Breakdown</Text>
                    <VStack spacing={3}>
                      {categoryData.map((cat, index) => (
                        <Box key={index} w="full" p={3} bg={`${cat.color}.50`} borderRadius="md">
                          <HStack justify="space-between">
                            <Text fontWeight="medium">{cat.name}</Text>
                            <Text fontWeight="bold" color={`${cat.color}.600`}>
                              ₹{cat.value.toLocaleString()}
                            </Text>
                          </HStack>
                          <Progress
                            value={(cat.value / user?.totalExpenses) * 100}
                            colorScheme={cat.color}
                            size="sm"
                            mt={2}
                          />
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={4}>Category Distribution</Text>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`var(--chakra-colors-${entry.color}-500)`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </SimpleGrid>
              </TabPanel>

              <TabPanel>
                <Text>Activity timeline and user actions will be displayed here...</Text>
              </TabPanel>

              <TabPanel>
                <Text>User settings and admin controls will be displayed here...</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function AdminDashboard() {
  const [users] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('totalExpenses');
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  // Calculate platform statistics
  const platformStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const premiumUsers = users.filter(u => u.premiumUser).length;
    const totalPlatformExpenses = users.reduce((sum, u) => sum + u.totalExpenses, 0);
    const totalMonthlyExpenses = users.reduce((sum, u) => sum + u.monthlyExpenses, 0);
    const avgExpensePerUser = totalPlatformExpenses / totalUsers;
    const premiumRate = (premiumUsers / totalUsers) * 100;

    // Category analysis across all users
    const categoryTotals = users.reduce((acc, user) => {
      Object.entries(user.categories).forEach(([cat, amount]) => {
        acc[cat] = (acc[cat] || 0) + amount;
      });
      return acc;
    }, {});

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        percentage: (amount / totalPlatformExpenses) * 100
      }));

    return {
      totalUsers,
      activeUsers,
      premiumUsers,
      totalPlatformExpenses,
      totalMonthlyExpenses,
      avgExpensePerUser,
      premiumRate,
      topCategories,
      userGrowthRate: 8.5, // Mock growth rate
      retentionRate: 85.2 // Mock retention rate
    };
  }, [users]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalExpenses':
          return b.totalExpenses - a.totalExpenses;
        case 'monthlyExpenses':
          return b.monthlyExpenses - a.monthlyExpenses;
        case 'expenseCount':
          return b.expenseCount - a.expenseCount;
        case 'joinDate':
          return new Date(b.joinDate) - new Date(a.joinDate);
        default:
          return 0;
      }
    });
  }, [users, searchTerm, statusFilter, sortBy]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryInfo = (value) => categories.find(c => c.value === value) || categories[categories.length - 1];

  const handleUserClick = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <Container maxW="8xl" py={8}>
      <Box bg={bgColor} minH="100vh" p={4}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center" mb={2}>
            <Box>
              <Heading size="lg" color={headingColor} mb={2}>
                Admin Dashboard
              </Heading>
              <Text color={textColor}>
                Monitor and manage all users on the expense tracking platform
              </Text>
            </Box>
            <HStack spacing={2}>
              <Button leftIcon={<FaDownload />} colorScheme="blue" size="sm">
                Export Data
              </Button>
              <Text fontSize="sm" color={textColor}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </HStack>
          </Flex>

          {/* Platform Overview Stats */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Total Users</StatLabel>
                  <StatNumber color="blue.500" fontSize="2xl">
                    {platformStats.totalUsers}
                  </StatNumber>
                  <StatHelpText>
                    <HStack>
                      <Icon as={FaArrowUp} color="green.500" />
                      <Text color="green.500">+{platformStats.userGrowthRate}% growth</Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Active Users</StatLabel>
                  <StatNumber color="green.500" fontSize="2xl">
                    {platformStats.activeUsers}
                  </StatNumber>
                  <StatHelpText>
                    {platformStats.retentionRate}% retention rate
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Platform Revenue</StatLabel>
                  <StatNumber color="purple.500" fontSize="2xl">
                    {formatCurrency(platformStats.totalPlatformExpenses)}
                  </StatNumber>
                  <StatHelpText>
                    Total tracked expenses
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Premium Users</StatLabel>
                  <StatNumber color="gold" fontSize="2xl">
                    {platformStats.premiumUsers}
                  </StatNumber>
                  <StatHelpText>
                    {platformStats.premiumRate.toFixed(1)}% conversion rate
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Secondary Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <HStack justify="space-between" mb={4}>
                  <Text fontWeight="bold" color={headingColor}>Monthly Activity</Text>
                  <Icon as={FaCalendar} color="blue.500" />
                </HStack>
                <Stat>
                  <StatNumber color="blue.500">
                    {formatCurrency(platformStats.totalMonthlyExpenses)}
                  </StatNumber>
                  <StatHelpText>Total this month</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <HStack justify="space-between" mb={4}>
                  <Text fontWeight="bold" color={headingColor}>Average per User</Text>
                  <Icon as={FaRupeeSign} color="green.500" />
                </HStack>
                <Stat>
                  <StatNumber color="green.500">
                    {formatCurrency(platformStats.avgExpensePerUser)}
                  </StatNumber>
                  <StatHelpText>Per user spending</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <HStack justify="space-between" mb={4}>
                  <Text fontWeight="bold" color={headingColor}>Top Category</Text>
                  <Icon as={getCategoryInfo(platformStats.topCategories[0]?.category).icon} color={`${getCategoryInfo(platformStats.topCategories[0]?.category).color}.500`} />
                </HStack>
                <Stat>
                  <StatNumber color={`${getCategoryInfo(platformStats.topCategories[0]?.category).color}.500`}>
                    {getCategoryInfo(platformStats.topCategories[0]?.category).label}
                  </StatNumber>
                  <StatHelpText>
                    {platformStats.topCategories[0]?.percentage.toFixed(1)}% of total
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* User Management Section */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md" color={headingColor}>User Management</Heading>
                <Badge colorScheme="blue" variant="outline">
                  {filteredUsers.length} users
                </Badge>
              </Flex>

              {/* Filters */}
              <HStack spacing={4} wrap="wrap">
                <InputGroup maxW="300px">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  maxW="150px"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>

                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  maxW="200px"
                >
                  <option value="totalExpenses">Total Expenses</option>
                  <option value="monthlyExpenses">Monthly Expenses</option>
                  <option value="expenseCount">Expense Count</option>
                  <option value="joinDate">Join Date</option>
                </Select>
              </HStack>
            </CardHeader>

            <CardBody>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>User</Th>
                      <Th>Status</Th>
                      <Th>Total Expenses</Th>
                      <Th>Monthly</Th>
                      <Th>Count</Th>
                      <Th>Top Category</Th>
                      <Th>Growth</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredUsers.map((user) => (
                      <Tr key={user.id} _hover={{ bg: "gray.50" }}>
                        <Td>
                          <HStack>
                            <Avatar size="sm" src={user.avatar} name={user.name} />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">{user.name}</Text>
                              <Text fontSize="xs" color="gray.500">{user.email}</Text>
                            </VStack>
                            {user.premiumUser && (
                              <Icon as={FaCrown} color="gold" />
                            )}
                          </HStack>
                        </Td>
                        <Td>
                          <Badge colorScheme={user.status === 'active' ? 'green' : 'red'}>
                            {user.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontWeight="bold" color="blue.500">
                            {formatCurrency(user.totalExpenses)}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight="medium">
                            {formatCurrency(user.monthlyExpenses)}
                          </Text>
                        </Td>
                        <Td>
                          <Text>{user.expenseCount}</Text>
                        </Td>
                        <Td>
                          <HStack>
                            <Icon
                              as={getCategoryInfo(user.topCategory).icon}
                              color={`${getCategoryInfo(user.topCategory).color}.500`}
                            />
                            <Text fontSize="sm">{getCategoryInfo(user.topCategory).label}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack>
                            <Icon
                              as={user.growthRate >= 0 ? FaArrowUp : FaArrowDown}
                              color={user.growthRate >= 0 ? "red.500" : "green.500"}
                            />
                            <Text
                              fontSize="sm"
                              color={user.growthRate >= 0 ? "red.500" : "green.500"}
                            >
                              {user.growthRate >= 0 ? '+' : ''}{user.growthRate}%
                            </Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            leftIcon={<FaEye />}
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => handleUserClick(user)}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>

          {/* Platform Analytics */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardHeader>
                <Heading size="md" color={headingColor}>Top Categories Platform-wide</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  {platformStats.topCategories.map((cat, index) => (
                    <Box key={index} w="full" p={3} bg={`${getCategoryInfo(cat.category).color}.50`} borderRadius="md">
                      <HStack justify="space-between" mb={2}>
                        <HStack>
                          <Icon
                            as={getCategoryInfo(cat.category).icon}
                            color={`${getCategoryInfo(cat.category).color}.600`}
                          />
                          <Text fontWeight="medium">{getCategoryInfo(cat.category).label}</Text>
                        </HStack>
                        <Text fontWeight="bold" color={`${getCategoryInfo(cat.category).color}.600`}>
                          {formatCurrency(cat.amount)}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Progress
                          value={cat.percentage}
                          colorScheme={`${getCategoryInfo(cat.category).color}`}
                          size="sm"
                          rounded="md"
                        />
                        <Text fontSize="sm" color="gray.500">
                          {cat.percentage.toFixed(1)}% of total expenses
                        </Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardHeader>
                <Heading size="md" color={headingColor}>Spending Distribution Overview</Heading>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={platformStats.topCategories.map(cat => ({
                      name: getCategoryInfo(cat.category).label,
                      value: cat.amount
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="value" fill="#3182CE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* User Detail Modal */}
          {selectedUser && (
            <UserDetailModal user={selectedUser} isOpen={isOpen} onClose={onClose} />
          )}

        </VStack>
      </Box>
    </Container>
  );
}
