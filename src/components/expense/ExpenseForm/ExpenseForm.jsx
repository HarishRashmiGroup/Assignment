import { Box, Button, FormControl, FormLabel, Input, Select, VStack } from '@chakra-ui/react';
import { useState } from 'react';

const ExpenseForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ amount, category, note });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} bg="white" boxShadow="md" borderRadius="md">
      <VStack spacing={4}>
        <FormControl id="amount">
          <FormLabel>Amount</FormLabel>
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        </FormControl>
        <FormControl id="category">
          <FormLabel>Category</FormLabel>
          <Select value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills</option>
            <option value="entertainment">Entertainment</option>
          </Select>
        </FormControl>
        <FormControl id="note">
          <FormLabel>Note</FormLabel>
          <Input value={note} onChange={e => setNote(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" type="submit" w="full">Add Expense</Button>
      </VStack>
    </Box>
  );
};

export default ExpenseForm; 