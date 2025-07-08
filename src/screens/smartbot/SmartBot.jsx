import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  Skeleton,
  Divider,
  Badge,
  Icon,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import {
  ChevronRightIcon,
  DownloadIcon,
  CalendarIcon,
  InfoIcon
} from '@chakra-ui/icons';
import useReports from '../../hooks/useReports';
import useSuggestions from '../../hooks/useSuggestions';

// Enhanced MonthlyReport Component
const MonthlyReport = ({ reports }) => (
  <Box p={4} bg="white" borderRadius="md" boxShadow="sm" border="1px" borderColor="gray.200">
    <HStack justify="space-between" mb={3}>
      <Heading size="md">Monthly Report</Heading>
      <Icon as={CalendarIcon} color="blue.500" />
    </HStack>
    {reports && reports.length > 0 ? (
      <VStack align="stretch" spacing={2}>
        {reports.slice(0, 3).map(r => (
          <Box
            key={r.id}
            p={3}
            bg="gray.50"
            borderRadius="sm"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            _hover={{ bg: "gray.100" }}
          >
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium" fontSize="sm">{r.month}</Text>
              <Text color="gray.600" fontSize="xs">
                {r.transactions || 0} transactions
              </Text>
            </VStack>
            <Text color="green.600" fontWeight="bold">
              ₹{r.total?.toLocaleString() || '0'}
            </Text>
          </Box>
        ))}
        {reports.length > 3 && (
          <Button variant="ghost" size="sm" rightIcon={<ChevronRightIcon />}>
            View all {reports.length} months
          </Button>
        )}
      </VStack>
    ) : (
      <Box textAlign="center" py={4}>
        <Text color="gray.500">No monthly data available</Text>
      </Box>
    )}
  </Box>
);

// Enhanced CategoryReport Component
const CategoryReport = ({ reports }) => {
  const topCategories = reports?.slice(0, 3) || [];

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm" border="1px" borderColor="gray.200">
      <HStack justify="space-between" mb={3}>
        <Heading size="md">Top Categories</Heading>
        <Badge colorScheme="purple">This Month</Badge>
      </HStack>
      {topCategories.length > 0 ? (
        <VStack align="stretch" spacing={2}>
          {topCategories.map((category, index) => (
            <Box
              key={category.id || index}
              p={3}
              bg="purple.50"
              borderRadius="sm"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack>
                <Badge variant="solid" colorScheme="purple" fontSize="xs">
                  #{index + 1}
                </Badge>
                <Text fontWeight="medium" fontSize="sm">
                  {category.name || 'Unknown'}
                </Text>
              </HStack>
              <Text color="purple.600" fontWeight="bold">
                ₹{category.amount?.toLocaleString() || '0'}
              </Text>
            </Box>
          ))}
        </VStack>
      ) : (
        <Box textAlign="center" py={4}>
          <Text color="gray.500">No category data available</Text>
        </Box>
      )}
    </Box>
  );
};

// Enhanced PaymentMethodReport Component
const PaymentMethodReport = ({ reports }) => (
  <Box p={4} bg="white" borderRadius="md" boxShadow="sm" border="1px" borderColor="gray.200">
    <HStack justify="space-between" mb={3}>
      <Heading size="md">Payment Methods</Heading>
      <Icon color="green.500" />
    </HStack>
    <VStack align="stretch" spacing={3}>
      <Stat>
        <StatLabel>Most Used</StatLabel>
        <StatNumber fontSize="lg">Credit Card</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>
      <Divider />
      <Text fontSize="sm" color="gray.600">
        Detailed breakdown coming soon...
      </Text>
    </VStack>
  </Box>
);

// Enhanced ReportExport Component
const ReportExport = ({ reports, onExport }) => (
  <Box p={4} bg="white" borderRadius="md" boxShadow="sm" border="1px" borderColor="gray.200">
    <HStack justify="space-between" mb={3}>
      <Heading size="md">Export Reports</Heading>
      <Icon as={DownloadIcon} color="blue.500" />
    </HStack>
    <VStack spacing={3}>
      <Button
        colorScheme="blue"
        size="sm"
        leftIcon={<DownloadIcon />}
        onClick={() => onExport?.('csv')}
        disabled={!reports || reports.length === 0}
        w="full"
      >
        Export as CSV
      </Button>
      <Button
        colorScheme="green"
        size="sm"
        variant="outline"
        leftIcon={<DownloadIcon />}
        onClick={() => onExport?.('pdf')}
        disabled={!reports || reports.length === 0}
        w="full"
      >
        Export as PDF
      </Button>
      <Text fontSize="xs" color="gray.500" textAlign="center">
        {reports?.length || 0} records available
      </Text>
    </VStack>
  </Box>
);

// Enhanced SuggestionCard Component
const SuggestionCard = ({ suggestion }) => (
  <Box
    p={4}
    bg="white"
    borderRadius="md"
    boxShadow="sm"
    border="1px"
    borderColor="gray.200"
    _hover={{
      boxShadow: "md",
      borderColor: "blue.300",
      transform: "translateY(-2px)"
    }}
    transition="all 0.2s"
  >
    <HStack align="start" spacing={3}>
      <Icon as={InfoIcon} color="blue.500" mt={1} />
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" fontWeight="medium">
          {suggestion.title || 'Suggestion'}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {suggestion.text}
        </Text>
        {suggestion.savings && (
          <Badge colorScheme="green" size="sm">
            Save ₹{suggestion.savings}
          </Badge>
        )}
      </VStack>
    </HStack>
  </Box>
);

// Enhanced SuggestionList Component
const SuggestionList = ({ suggestions }) => (
  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
    {suggestions.map(s => (
      <SuggestionCard key={s.id} suggestion={s} />
    ))}
  </SimpleGrid>
);

// Enhanced SmartSuggestions Component
const SmartSuggestions = ({ suggestions, loading }) => (
  <Box>
    <HStack justify="space-between" mb={4}>
      <Heading size="md">Smart Suggestions</Heading>
      <Badge colorScheme="blue" variant="outline">
        {suggestions?.length || 0} tips
      </Badge>
    </HStack>
    {loading ? (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {[...Array(4)].map((_, i) => (
          <Box key={i} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <Skeleton height="60px" />
          </Box>
        ))}
      </SimpleGrid>
    ) : suggestions && suggestions.length > 0 ? (
      <SuggestionList suggestions={suggestions} />
    ) : (
      <Box
        p={6}
        bg="white"
        borderRadius="md"
        boxShadow="sm"
        textAlign="center"
        border="1px"
        borderColor="gray.200"
      >
        <Text color="gray.500">No suggestions available at the moment</Text>
      </Box>
    )}
  </Box>
);

// Loading Component
const LoadingReports = () => (
  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
    {[...Array(4)].map((_, i) => (
      <Box key={i} p={4} bg="white" borderRadius="md" boxShadow="sm">
        <Skeleton height="20px" mb={2} />
        <Skeleton height="60px" />
      </Box>
    ))}
  </SimpleGrid>
);

// Error Component
const ErrorDisplay = ({ error }) => (
  <Alert status="error" borderRadius="md">
    <AlertIcon />
    <VStack align="start" spacing={1}>
      <Text fontWeight="medium">Error loading data</Text>
      <Text fontSize="sm">{error.message || 'Something went wrong'}</Text>
    </VStack>
  </Alert>
);

// Main Combined Component
export default function SmartBot() {
  const { reports, loading: reportsLoading, error: reportsError } = useReports();
  const { suggestions, loading: suggestionsLoading, error: suggestionsError } = useSuggestions();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleExport = (format) => {
    console.log(`Exporting reports as ${format}`);
    // Add your export logic here
  };

  return (
    <Container maxW='8xl' py={8} >
      <Box bg={bgColor} minH="100vh" p={4}>
        {/* Reports Section */}
        <VStack align="stretch" spacing={6}>
          <Box>
            <Box>
              <Heading size="lg" color={headingColor} mb={2}>
                Smart Expense Tracking & Planning
              </Heading>
              <Text color={textColor} mb={4}>
                Smart planning tips and powerful reports to manage your spending better.
              </Text>
            </Box>
            {reportsError ? (
              <ErrorDisplay error={reportsError} />
            ) : reportsLoading ? (
              <LoadingReports />
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <MonthlyReport reports={reports} />
                <CategoryReport reports={reports} />
                <PaymentMethodReport reports={reports} />
                <ReportExport reports={reports} onExport={handleExport} />
              </SimpleGrid>
            )}
          </Box>

          {/* Suggestions Section */}
          <Box>
            {suggestionsError ? (
              <ErrorDisplay error={suggestionsError} />
            ) : (
              <SmartSuggestions
                suggestions={suggestions}
                loading={suggestionsLoading}
              />
            )}
          </Box>
        </VStack>
      </Box>
    </Container>
  );
}