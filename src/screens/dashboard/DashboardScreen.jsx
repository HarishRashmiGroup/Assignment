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
  Spacer, 
  Button, 
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { 
  FaWallet, 
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
  FaBox
} from 'react-icons/fa';
import { useMemo } from 'react';
import useExpenses from '../../hooks/useExpenses';
import DashboardStats from '../../components/dashboard/DashboardStats/DashboardStats';
import CategoryChart from '../../components/dashboard/CategoryChart/CategoryChart';
import SpendingTrend from '../../components/dashboard/SpendingTrend/SpendingTrend';
import RecentExpenses from '../../components/dashboard/RecentExpenses/RecentExpenses';
import ExpenseStats from '../../components/expense/ExpenseStats/ExpenseStats';

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

export default function DashboardScreen() {
  const { expenses, loading } = useExpenses({ year: 2025, month: 7 });
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  // Get category info helper
  const getCategoryInfo = (value) => categories.find(c => c.value === value) || categories[categories.length - 1];

  // Memoized calculations for better performance
  const dashboardData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        totalSpent: 0,
        totalExpenses: 0,
        avgExpense: 0,
        thisMonthTotal: 0,
        lastMonthTotal: 0,
        currentMonthExpenses: [],
        recentExpenses: [],
        pieData: [],
        lineData: [],
        categoryBreakdown: [],
        monthlyGrowth: 0,
        weeklySpending: 0,
        topCategory: null
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Filter expenses for current month
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    // Filter expenses for last month
    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
    });

    // Calculate totals
    const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const thisMonthTotal = totalSpent;
    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // Calculate monthly growth
    const monthlyGrowth = lastMonthTotal > 0 
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
      : 0;

    // Calculate weekly spending (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySpending = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekAgo;
    }).reduce((sum, e) => sum + Number(e.amount), 0);

    // Category analysis
    const categoryTotals = currentMonthExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});
    
    const topCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];

    // Category breakdown with details
    const categoryBreakdown = categories.map(cat => ({
      ...cat,
      total: categoryTotals[cat.value] || 0,
      count: currentMonthExpenses.filter(exp => exp.category === cat.value).length,
      percentage: totalSpent > 0 ? ((categoryTotals[cat.value] || 0) / totalSpent) * 100 : 0
    })).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);

    // Recent expenses (last 10, sorted by date)
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Chart data
    const pieData = categoryBreakdown.map(cat => ({ 
      name: cat.label, 
      value: cat.total,
      percentage: cat.percentage.toFixed(1),
      color: cat.color
    }));

    // Spending trend for last 30 days
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExpenses = expenses.filter(e => 
        e.date === dateStr
      ).reduce((sum, e) => sum + Number(e.amount), 0);
      
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: dayExpenses,
        fullDate: dateStr
      });
    }

    return {
      totalSpent,
      totalExpenses,
      avgExpense,
      thisMonthTotal,
      lastMonthTotal,
      currentMonthExpenses,
      recentExpenses,
      pieData,
      lineData: last30Days,
      categoryBreakdown,
      monthlyGrowth,
      weeklySpending,
      topCategory
    };
  }, [expenses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowthPercentage = (percentage) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
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
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center" mb={2}>
            <Box>
              <Heading size="lg" color={headingColor} mb={2}>
                Expense Dashboard
              </Heading>
              <Text color={textColor}>
                Track and manage your financial expenses with detailed insights
              </Text>
            </Box>
            <HStack spacing={2}>
              <Text fontSize="sm" color={textColor}>
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </HStack>
          </Flex>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>This Month</StatLabel>
                  <StatNumber color="blue.500" fontSize="2xl">
                    {formatCurrency(dashboardData.thisMonthTotal)}
                  </StatNumber>
                  <StatHelpText>
                    <HStack>
                      <Icon 
                        as={dashboardData.monthlyGrowth >= 0 ? FaArrowUp : FaArrowDown} 
                        color={dashboardData.monthlyGrowth >= 0 ? "red.500" : "green.500"}
                      />
                      <Text color={dashboardData.monthlyGrowth >= 0 ? "red.500" : "green.500"}>
                        {formatGrowthPercentage(dashboardData.monthlyGrowth)} vs last month
                      </Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Total Expenses</StatLabel>
                  <StatNumber color="purple.500" fontSize="2xl">
                    {formatCurrency(dashboardData.totalExpenses)}
                  </StatNumber>
                  <StatHelpText>
                    {expenses.length} total transactions
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Weekly Spending</StatLabel>
                  <StatNumber color="orange.500" fontSize="2xl">
                    {formatCurrency(dashboardData.weeklySpending)}
                  </StatNumber>
                  <StatHelpText>
                    Last 7 days
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Average Expense</StatLabel>
                  <StatNumber color="green.500" fontSize="2xl">
                    {formatCurrency(dashboardData.avgExpense)}
                  </StatNumber>
                  <StatHelpText>
                    Per transaction
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Enhanced Stats Component */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <Heading size="md" color={headingColor}>Financial Overview</Heading>
            </CardHeader>
            <CardBody>
              <ExpenseStats 
                total={dashboardData.thisMonthTotal} 
                count={dashboardData.currentMonthExpenses.length}
                avgExpense={dashboardData.avgExpense}
                topCategory={dashboardData.topCategory?.[0] || 'No expenses'}
                categoryBreakdown={dashboardData.categoryBreakdown}
              />
            </CardBody>
          </Card>

          {/* Charts Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardHeader>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color={headingColor}>Category Breakdown</Heading>
                  <Text fontSize="sm" color={textColor}>Current month spending distribution</Text>
                </VStack>
              </CardHeader>
              <CardBody>
                {dashboardData.pieData.length > 0 ? (
                  <CategoryChart data={dashboardData.pieData} />
                ) : (
                  <VStack py={8} spacing={4}>
                    <Icon as={FaWallet} boxSize={12} color="gray.400" />
                    <Text color="gray.500">No expenses this month</Text>
                  </VStack>
                )}
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardHeader>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color={headingColor}>30-Day Spending Trend</Heading>
                  <Text fontSize="sm" color={textColor}>Daily expense pattern</Text>
                </VStack>
              </CardHeader>
              <CardBody>
                <SpendingTrend data={dashboardData.lineData} />
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Recent Expenses */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Heading size="md" color={headingColor}>Recent Expenses</Heading>
                  <Text fontSize="sm" color={textColor}>Your latest financial transactions</Text>
                </VStack>
                {dashboardData.recentExpenses.length > 0 && (
                  <Badge colorScheme="blue" variant="subtle">
                    {dashboardData.recentExpenses.length} recent
                  </Badge>
                )}
              </Flex>
            </CardHeader>
            <CardBody>
              {dashboardData.recentExpenses.length > 0 ? (
                <RecentExpenses expenses={dashboardData.recentExpenses} />
              ) : (
                <VStack py={8} spacing={4}>
                  <Icon as={FaChartLine} boxSize={12} color="gray.400" />
                  <Text color="gray.500">No recent expenses</Text>
                  <Text fontSize="sm" color="gray.400" textAlign="center">
                    Start tracking your expenses to see insights here
                  </Text>
                </VStack>
              )}
            </CardBody>
          </Card>

          {/* Category Insights */}
          {dashboardData.categoryBreakdown.length > 0 && (
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardHeader>
                <Heading size="md" color={headingColor}>Category Insights</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {dashboardData.categoryBreakdown.slice(0, 6).map((category) => (
                    <Box key={category.value} p={4} bg={`${category.color}.50`} borderRadius="lg">
                      <HStack justify="space-between" mb={2}>
                        <HStack>
                          <Icon 
                            as={category.icon} 
                            color={`${category.color}.600`} 
                            boxSize={5} 
                          />
                          <Text fontWeight="medium" color={headingColor}>
                            {category.label}
                          </Text>
                        </HStack>
                        <Badge colorScheme={category.color} variant="solid">
                          {category.percentage.toFixed(1)}%
                        </Badge>
                      </HStack>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold" color={`${category.color}.600`}>
                          {formatCurrency(category.total)}
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          {category.count} transaction{category.count !== 1 ? 's' : ''}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          )}

          {/* Monthly Summary */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <Heading size="md" color={headingColor}>Monthly Summary</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color={textColor}>Highest Single Expense</Text>
                  <Text fontSize="xl" fontWeight="bold" color="red.500">
                    {dashboardData.currentMonthExpenses.length > 0 
                      ? formatCurrency(Math.max(...dashboardData.currentMonthExpenses.map(e => Number(e.amount))))
                      : formatCurrency(0)
                    }
                  </Text>
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color={textColor}>Most Active Category</Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.500">
                    {dashboardData.topCategory ? getCategoryInfo(dashboardData.topCategory[0]).label : 'None'}
                  </Text>
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color={textColor}>Daily Average</Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.500">
                    {dashboardData.currentMonthExpenses.length > 0 
                      ? formatCurrency(dashboardData.thisMonthTotal / new Date().getDate())
                      : formatCurrency(0)
                    }
                  </Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Container>
  );
}