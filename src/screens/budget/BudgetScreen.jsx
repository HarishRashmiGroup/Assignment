import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  VStack,
  SimpleGrid,
  Button,
  useDisclosure,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Badge,
  Icon,
  useColorModeValue,
  Container,
  HStack,
  Spacer,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  useToast,
  Skeleton
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  FaWallet, FaExclamationTriangle, FaCheckCircle, FaChartLine,
  FaUtensils,
  FaCar,
  FaShoppingBag,
  FaLightbulb,
  FaGamepad,
  FaHeart,
  FaGraduationCap,
  FaBox
} from 'react-icons/fa';
import useBudget from '../../hooks/useBudget';
import useExpenses from '../../hooks/useExpenses';
import BudgetList from '../../components/budget/BudgetList/BudgetList';
import BudgetAlert from '../../components/budget/BudgetAlert/BudgetAlert';
import BudgetProgress from '../../components/budget/BudgetProgress/BudgetProgress';
import BudgetForm from '../../components/budget/BudgetForm/BudgetForm';

const categories = [
  { id: '1', name: 'food', label: 'Food & Dining', icon: FaUtensils, color: 'orange' },
  { id: '2', name: 'transport', label: 'Transportation', icon: FaCar, color: 'blue' },
  { id: '3', name: 'shopping', label: 'Shopping', icon: FaShoppingBag, color: 'purple' },
  { id: '4', name: 'bills', label: 'Bills & Utilities', icon: FaLightbulb, color: 'yellow' },
  { id: '5', name: 'entertainment', label: 'Entertainment', icon: FaGamepad, color: 'green' },
  { id: '6', name: 'health', label: 'Health & Medical', icon: FaHeart, color: 'red' },
  { id: '7', name: 'education', label: 'Education', icon: FaGraduationCap, color: 'teal' },
  { id: '8', name: 'others', label: 'Others', icon: FaBox, color: 'gray' }
];

export default function BudgetScreen() {
  const { budgets, loading, addOrUpdate, deleteBudget } = useBudget({ year: 2025, month: 7 });
  const { expenses } = useExpenses({ year: 2025, month: 7 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Get current month's expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();

      switch (selectedPeriod) {
        case 'current':
          return expenseMonth === currentMonth && expenseYear === currentYear;
        case 'previous':
          const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return expenseMonth === prevMonth && expenseYear === prevYear;
        default:
          return true;
      }
    });
  }, [expenses, selectedPeriod, currentMonth, currentYear]);

  // Calculate spent per category
  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const categoryExpenses = filteredExpenses.filter(e => e.category === cat.name);
      const spent = categoryExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const budget = budgets.find(b => b.category === cat.name);
      const budgetAmount = budget ? Number(budget.amount) : 0;
      const percentage = budgetAmount ? Math.round((spent / budgetAmount) * 100) : 0;

      let status = 'safe';
      if (budgetAmount && percentage >= 100) status = 'over';
      else if (budgetAmount && percentage >= 80) status = 'warning';

      return {
        ...cat,
        spent,
        budget: budgetAmount,
        percentage,
        status,
        remaining: Math.max(0, budgetAmount - spent),
        expenseCount: categoryExpenses.length
      };
    });
  }, [filteredExpenses, budgets]);

  // Filter categories based on search and filter
  const filteredCategories = useMemo(() => {
    return categoryStats.filter(cat => {
      const matchesSearch = cat.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !filterCategory ||
        (filterCategory === 'over' && cat.status === 'over') ||
        (filterCategory === 'warning' && cat.status === 'warning') ||
        (filterCategory === 'safe' && cat.status === 'safe') ||
        (filterCategory === 'no-budget' && cat.budget === 0);

      return matchesSearch && matchesFilter;
    });
  }, [categoryStats, searchQuery, filterCategory]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalBudget = categoryStats.reduce((sum, cat) => sum + cat.budget, 0);
    const totalSpent = categoryStats.reduce((sum, cat) => sum + cat.spent, 0);
    const totalRemaining = Math.max(0, totalBudget - totalSpent);
    const overBudgetCount = categoryStats.filter(cat => cat.status === 'over').length;
    const warningCount = categoryStats.filter(cat => cat.status === 'warning').length;
    const noBudgetCount = categoryStats.filter(cat => cat.budget === 0).length;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      overBudgetCount,
      warningCount,
      noBudgetCount,
      overallPercentage: totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0
    };
  }, [categoryStats]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'over': return 'red';
      case 'warning': return 'orange';
      case 'safe': return 'green';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'over': return FaExclamationTriangle;
      case 'warning': return FaExclamationTriangle;
      case 'safe': return FaCheckCircle;
      default: return FaWallet;
    }
  };

  const handleQuickSetBudget = (category, amount) => {
    setSelectedCategory(category);
    onOpen();
    // addOrUpdate({ category, amount });
    // toast({
    //   title: 'Budget Updated',
    //   description: `Budget for ${category} set to ₹${amount}`,
    //   status: 'success',
    //   duration: 3000,
    //   isClosable: true,
    // });
  };

  if (loading) {
    return (
      <Container maxW="8xl" py={8}>
        <Box bg={bgColor} minH="100vh" p={4}>
          <VStack spacing={6} align="stretch">
            <Skeleton height="60px" />
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              {[1, 2, 3, 4].map(i => (
                <Card key={i} bg={cardBg} borderColor={borderColor}>
                  <CardBody>
                    <Skeleton height="80px" />
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Card bg={cardBg} borderColor={borderColor}>
                <CardBody>
                  <Skeleton height="300px" />
                </CardBody>
              </Card>
              <Card bg={cardBg} borderColor={borderColor}>
                <CardBody>
                  <Skeleton height="300px" />
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="8xl" py={8}>
      <Box bg={bgColor} minH="100vh" p={4}>
        {/* Header */}
        <Flex mb={6} align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" mb={2}>Budget Management</Heading>
            <Text color="gray.600">
              Track and manage your monthly budgets across different categories
            </Text>
          </Box>
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onOpen}
            size="md"
          >
            Set Budget
          </Button>
        </Flex>

        {/* Overall Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Budget</StatLabel>
                <StatNumber color="blue.500">₹{overallStats.totalBudget.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <Icon as={FaWallet} mr={1} />
                  Monthly allocation
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Spent</StatLabel>
                <StatNumber color="red.500">₹{overallStats.totalSpent.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type={overallStats.overallPercentage > 100 ? 'increase' : 'decrease'} />
                  {overallStats.overallPercentage}% of budget
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Remaining</StatLabel>
                <StatNumber color="green.500">₹{overallStats.totalRemaining.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <Icon as={FaChartLine} mr={1} />
                  Available to spend
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Alerts</StatLabel>
                <StatNumber color="orange.500">{overallStats.overBudgetCount + overallStats.warningCount}</StatNumber>
                <StatHelpText>
                  <Text as="span" color="red.500">{overallStats.overBudgetCount} over</Text>
                  <Text as="span" mx={1}>•</Text>
                  <Text as="span" color="orange.500">{overallStats.warningCount} warning</Text>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Card bg={cardBg} borderColor={borderColor} mb={6}>
          <CardBody>
            <Flex gap={4} wrap="wrap" align="center">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <Select
                maxW="200px"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="over">Over Budget</option>
                <option value="warning">Warning (80%+)</option>
                <option value="safe">Under Budget</option>
                <option value="no-budget">No Budget Set</option>
              </Select>

              <Select
                maxW="200px"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="current">Current Month</option>
                <option value="previous">Previous Month</option>
                <option value="all">All Time</option>
              </Select>
            </Flex>
          </CardBody>
        </Card>

        {/* Category Budget Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6} mb={8}>
          {filteredCategories.map(cat => (
            <Card key={cat.name} bg={cardBg} borderColor={borderColor} position="relative">
              <CardHeader pb={2}>
                <Flex align="center" justify="space-between">
                  <HStack>
                    <Box
                      p={3}
                      bg={`${cat.color}.100`}
                      borderRadius="md"
                      color={`${cat.color}.600`}
                    >
                      <Icon as={cat.icon} boxSize={6} />
                    </Box>
                    <Box>
                      <Heading size="sm">{cat.label}</Heading>
                      <Text fontSize="sm" color="gray.500">
                        {cat.expenseCount} transactions
                      </Text>
                    </Box>
                  </HStack>
                  <Badge
                    colorScheme={getStatusColor(cat.status)}
                    variant="subtle"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={getStatusIcon(cat.status)} boxSize={3} />
                    {cat.status === 'over' && 'Over Budget'}
                    {cat.status === 'warning' && 'Warning'}
                    {cat.status === 'safe' && 'On Track'}
                    {cat.budget === 0 && 'No Budget'}
                  </Badge>
                </Flex>
              </CardHeader>

              <CardBody pt={0}>
                {cat.budget > 0 ? (
                  <VStack align="stretch" spacing={3}>
                    <BudgetProgress
                      value={cat.spent}
                      max={cat.budget}
                      colorScheme={getStatusColor(cat.status)}
                    />

                    <Flex justify="space-between" fontSize="sm">
                      <Text>Spent: <strong>₹{cat.spent.toLocaleString()}</strong></Text>
                      <Text>Budget: <strong>₹{cat.budget.toLocaleString()}</strong></Text>
                    </Flex>

                    <Flex justify="space-between" fontSize="sm" color="gray.600">
                      <Text>Remaining: ₹{cat.remaining.toLocaleString()}</Text>
                      <Text>{cat.percentage}% used</Text>
                    </Flex>

                    {cat.status !== 'safe' && (
                      <Box mt={2}>
                        <BudgetAlert
                          message={
                            cat.status === 'over'
                              ? `Over budget by ₹${(cat.spent - cat.budget).toLocaleString()}`
                              : `${cat.percentage}% of budget used`
                          }
                          status={cat.status === 'over' ? 'error' : 'warning'}
                        />
                      </Box>
                    )}
                  </VStack>
                ) : (
                  <VStack spacing={3}>
                    <Text color="gray.500" textAlign="center">
                      No budget set for this category
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Total spent: ₹{cat.spent.toLocaleString()}
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleQuickSetBudget(cat, cat.spent * 1.2)}
                    >
                      Set Budget (₹{Math.round(cat.spent * 1.2).toLocaleString()})
                    </Button>
                  </VStack>
                )}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <BudgetForm
          isOpen={isOpen}
          onClose={onClose}
          month={7}
          year={2025}
          onSubmit={addOrUpdate}
          categories={categories}
          selectedCategory={selectedCategory}
          existingBudgets={budgets}
        />
      </Box>
    </Container>
  );
}