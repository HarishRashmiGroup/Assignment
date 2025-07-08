import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Select,
  VStack,
  HStack,
  Text,
  Container,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Flex,
  Badge,
  Icon,
  IconButton,
  useColorModeValue,
  useDisclosure,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Textarea,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  SkeletonText
} from '@chakra-ui/react';
import {
  AddIcon,
  SearchIcon,
  CalendarIcon,
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  ViewIcon,
  ChevronDownIcon,
  CloseIcon
} from '@chakra-ui/icons';
import {
  FaWallet,
  FaUtensils,
  FaCar,
  FaShoppingBag,
  FaLightbulb,
  FaGamepad,
  FaHeart,
  FaGraduationCap,
  FaBox,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobile,
  FaFilter,
  FaSort,
  FaChartLine
} from 'react-icons/fa';
import useExpenses from '../../hooks/useExpenses';
import ExpenseForm from '../../components/expense/ExpenseForm/ExpenseForm';
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

const paymentMethods = [
  { value: 'UPI', label: 'UPI', icon: FaMobile, color: 'blue' },
  { value: 'Credit Card', label: 'Credit Card', icon: FaCreditCard, color: 'purple' },
  { value: 'Debit Card', label: 'Debit Card', icon: FaCreditCard, color: 'orange' },
  { value: 'Cash', label: 'Cash', icon: FaMoneyBillWave, color: 'green' },
  { value: 'Net Banking', label: 'Net Banking', icon: FaWallet, color: 'teal' }
];

const sortOptions = [
  { value: 'date-desc', label: 'Latest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'amount-desc', label: 'Highest Amount' },
  { value: 'amount-asc', label: 'Lowest Amount' },
  { value: 'category', label: 'Category A-Z' }
];

export default function ExpensesScreen() {
  const { expenses, loading, add, remove, update } = useExpenses({ year: 2025, month: 7 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isStatsOpen,
    onOpen: onStatsOpen,
    onClose: onStatsClose
  } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    paymentMethod: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState('cards'); 

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getCategoryInfo = (value) => categories.find(c => c.value === value) || categories[categories.length - 1];
  const getPaymentInfo = (value) => paymentMethods.find(p => p.value === value) || paymentMethods[paymentMethods.length - 1];

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses?.filter(expense => {
      const matchesSearch = !filters.search ||
        expense.note?.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.paymentMethod.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = !filters.category || expense.category === filters.category;
      const matchesPayment = !filters.paymentMethod || expense.paymentMethod === filters.paymentMethod;

      const expenseDate = new Date(expense.date);
      const matchesDateFrom = !filters.dateFrom || expenseDate >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || expenseDate <= new Date(filters.dateTo);

      const matchesAmountMin = !filters.amountMin || Number(expense.amount) >= Number(filters.amountMin);
      const matchesAmountMax = !filters.amountMax || Number(expense.amount) <= Number(filters.amountMax);

      return matchesSearch && matchesCategory && matchesPayment &&
        matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
    });

    // Sort expenses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return Number(b.amount) - Number(a.amount);
        case 'amount-asc':
          return Number(a.amount) - Number(b.amount);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, filters, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalExpenses = filteredAndSortedExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const totalCount = filteredAndSortedExpenses.length;
    const avgExpense = totalCount > 0 ? totalExpenses / totalCount : 0;

    const today = new Date();
    const thisMonth = filteredAndSortedExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
    });
    const thisMonthTotal = thisMonth.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const categoryBreakdown = categories.map(cat => ({
      ...cat,
      total: filteredAndSortedExpenses
        .filter(exp => exp.category === cat.value)
        .reduce((sum, exp) => sum + Number(exp.amount), 0),
      count: filteredAndSortedExpenses.filter(exp => exp.category === cat.value).length
    })).filter(cat => cat.total > 0);

    return {
      totalExpenses,
      totalCount,
      avgExpense,
      thisMonthTotal,
      categoryBreakdown
    };
  }, [filteredAndSortedExpenses]);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category || !formData.paymentMethod) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: Number(formData.amount),
        date: formData.date || new Date().toISOString().split('T')[0],
        id: isEditing ? editingId : Date.now()
      };

      console.log(expenseData);
      if (isEditing) {
        await update(editingId, expenseData);
        toast({
          title: 'Expense Updated',
          description: 'Your expense has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await add(expenseData);
        toast({
          title: 'Expense Added',
          description: 'Your expense has been recorded successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      setFormData({
        amount: '',
        category: '',
        paymentMethod: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
      setEditingId(null);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save expense. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      note: expense.note || '',
      date: expense.date
    });
    setIsEditing(true);
    setEditingId(expense.id);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      toast({
        title: 'Expense Deleted',
        description: 'Your expense has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

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
        <Flex mb={6} align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" mb={2}>Expense Tracker</Heading>
            <Text color="gray.600">
              Track and manage your daily expenses with detailed insights
            </Text>
          </Box>
          <Spacer />
          <HStack spacing={2}>
            <Button
              leftIcon={<Icon as={FaChartLine} />}
              variant="outline"
              onClick={onStatsOpen}
            >
              Statistics
            </Button>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Add Expense
            </Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Expenses</StatLabel>
                <StatNumber color="red.500">₹{stats.totalExpenses.toLocaleString()}</StatNumber>
                <StatHelpText>{stats.totalCount} transactions</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>This Month</StatLabel>
                <StatNumber color="blue.500">₹{stats.thisMonthTotal.toLocaleString()}</StatNumber>
                <StatHelpText>Current month spending</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Average Expense</StatLabel>
                <StatNumber color="purple.500">₹{Math.round(stats.avgExpense).toLocaleString()}</StatNumber>
                <StatHelpText>Per transaction</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Active Filters</StatLabel>
                <StatNumber color="orange.500">{activeFiltersCount}</StatNumber>
                <StatHelpText>Applied filters</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card bg={cardBg} borderColor={borderColor} mb={6}>
          <CardHeader>
            <Flex align="center" gap={2}>
              <Icon as={FaFilter} />
              <Heading size="sm">Filters & Search</Heading>
              {activeFiltersCount > 0 && (
                <Badge colorScheme="blue" variant="subtle">
                  {activeFiltersCount} active
                </Badge>
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search expenses..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </InputGroup>

                <Select
                  placeholder="All Categories"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </Select>

                <Select
                  placeholder="All Payment Methods"
                  value={filters.paymentMethod}
                  onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </Select>
              </SimpleGrid>

              {/* <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Input
                  type="date"
                  placeholder="From Date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
                <Input
                  type="date"
                  placeholder="To Date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Min Amount"
                  value={filters.amountMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, amountMin: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Max Amount"
                  value={filters.amountMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, amountMax: e.target.value }))}
                />
              </SimpleGrid> */}

              <HStack justify="space-between">
                <HStack>
                  {/* <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    w="200px"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select> */}
                  <Button
                    variant={viewMode === 'cards' ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                  >
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    Table
                  </Button>
                </HStack>
                <Button
                  leftIcon={<CloseIcon />}
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  isDisabled={activeFiltersCount === 0}
                >
                  Clear Filters
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {loading ? (
          <VStack spacing={4}>
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} bg={cardBg} borderColor={borderColor} w="100%">
                <CardBody>
                  <HStack>
                    <Skeleton height="40px" width="40px" borderRadius="md" />
                    <VStack align="start" flex={1} spacing={2}>
                      <Skeleton height="20px" width="200px" />
                      <SkeletonText noOfLines={1} width="300px" />
                    </VStack>
                    <Skeleton height="20px" width="80px" />
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        ) : filteredAndSortedExpenses.length === 0 ? (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <VStack py={8} spacing={4}>
                <Icon as={FaWallet} boxSize={12} color="gray.400" />
                <Text fontSize="lg" color="gray.500">No expenses found</Text>
                <Text color="gray.400" textAlign="center">
                  {activeFiltersCount > 0
                    ? "Try adjusting your filters to see more expenses"
                    : "Start by adding your first expense"
                  }
                </Text>
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
                  Add First Expense
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : viewMode === 'cards' ? (
          <VStack spacing={4}>
            {filteredAndSortedExpenses.map((expense) => {
              const categoryInfo = getCategoryInfo(expense.category);
              const paymentInfo = getPaymentInfo(expense.paymentMethod);

              return (
                <Card key={expense.id} bg={cardBg} borderColor={borderColor} w="100%">
                  <CardBody>
                    <HStack spacing={4}>
                      <Box
                        p={3}
                        bg={`${categoryInfo.color}.100`}
                        borderRadius="md"
                        color={`${categoryInfo.color}.600`}
                      >
                        <Icon as={categoryInfo.icon} boxSize={6} />
                      </Box>

                      <VStack align="start" flex={1} spacing={1}>
                        <HStack>
                          <Text fontWeight="bold" fontSize="lg">
                            ₹{Number(expense.amount).toLocaleString()}
                          </Text>
                          <Badge colorScheme={categoryInfo.color} variant="subtle">
                            {categoryInfo.label}
                          </Badge>
                        </HStack>

                        <HStack spacing={4} fontSize="sm" color="gray.600">
                          <HStack>
                            <Icon as={paymentInfo.icon} />
                            <Text>{paymentInfo.label}</Text>
                          </HStack>
                          <HStack>
                            <CalendarIcon />
                            <Text>{new Date(expense.date).toLocaleDateString()}</Text>
                          </HStack>
                        </HStack>

                        {expense.note && (
                          <Text fontSize="sm" color="gray.500" noOfLines={1}>
                            {expense.note}
                          </Text>
                        )}
                      </VStack>

                      <HStack>
                        <IconButton
                          icon={<EditIcon />}
                          variant="ghost"
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEdit(expense)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          variant="ghost"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(expense.id)}
                        />
                      </HStack>
                    </HStack>
                  </CardBody>
                </Card>
              );
            })}
          </VStack>
        ) : (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Category</Th>
                      <Th>Amount</Th>
                      <Th>Payment Method</Th>
                      <Th>Note</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredAndSortedExpenses.map((expense) => {
                      const categoryInfo = getCategoryInfo(expense.category);
                      const paymentInfo = getPaymentInfo(expense.paymentMethod);

                      return (
                        <Tr key={expense.id}>
                          <Td>{new Date(expense.date).toLocaleDateString()}</Td>
                          <Td>
                            <HStack>
                              <Icon as={categoryInfo.icon} color={`${categoryInfo.color}.500`} />
                              <Text>{categoryInfo.label}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontWeight="bold">₹{Number(expense.amount).toLocaleString()}</Text>
                          </Td>
                          <Td>
                            <HStack>
                              <Icon as={paymentInfo.icon} color={`${paymentInfo.color}.500`} />
                              <Text>{paymentInfo.label}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Text noOfLines={1} maxW="200px">
                              {expense.note || '-'}
                            </Text>
                          </Td>
                          <Td>
                            <HStack>
                              <IconButton
                                icon={<EditIcon />}
                                variant="ghost"
                                size="sm"
                                colorScheme="blue"
                                onClick={() => handleEdit(expense)}
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                variant="ghost"
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleDelete(expense.id)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        )}

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                  <FormControl isRequired>
                    <FormLabel>Amount</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" color="gray.300">
                        ₹
                      </InputLeftElement>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select
                      placeholder="Select category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      placeholder="Select payment method"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Note (Optional)</FormLabel>
                  <Textarea
                    placeholder="Add a note about this expense..."
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                {isEditing ? 'Update' : 'Add'} Expense
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isStatsOpen} onClose={onStatsClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Expense Statistics</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ExpenseStats expenses={filteredAndSortedExpenses} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
}