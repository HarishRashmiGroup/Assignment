import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import AppProviders from './providers/appProvider';
import { AuthProvider } from './providers/authProvider';

// Screens
import DashboardScreen from './screens/dashboard/DashboardScreen';
import ExpensesScreen from './screens/expenses/ExpensesScreen';
import BudgetScreen from './screens/budget/BudgetScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminUsersScreen from './screens/admin/AdminUsersScreen';
import LoginScreen from './screens/auth/LoginScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import Header from './components/common/Header/Header';
import SmartBot from './screens/smartbot/SmartBot';

function App() {
  return (
    <Router>
      <AuthProvider>
      <AppProviders>
        <Suspense fallback={<Box width="full" height="100vh" display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
        </Box>}>
          <Header />
          <Box>
            <Routes>
              <Route path="/" element={<DashboardScreen />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/expenses" element={<ExpensesScreen />} />
              <Route path="/budget" element={<BudgetScreen />} />
              <Route path="/smart-bot" element={<SmartBot />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/admin" element={<AdminDashboardScreen />} />
              <Route path="/admin/users" element={<AdminUsersScreen />} />
              <Route path="/auth" element={<LoginScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
              <Route path="*" element={<Box p={6}><h2>404 - Not Found</h2></Box>} />
            </Routes>
          </Box>
        </Suspense>
      </AppProviders>
      </AuthProvider>
    </Router>
  );
}

export default App;
