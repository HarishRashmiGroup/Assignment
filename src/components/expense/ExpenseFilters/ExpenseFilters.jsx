import { HStack, Select, Input, Button } from '@chakra-ui/react';

const ExpenseFilters = ({ onFilter }) => (
  <HStack spacing={3} mb={4}>
    <Select placeholder="Category" onChange={e => onFilter && onFilter('category', e.target.value)}>
      <option value="food">Food</option>
      <option value="transport">Transport</option>
      <option value="shopping">Shopping</option>
      <option value="bills">Bills</option>
      <option value="entertainment">Entertainment</option>
    </Select>
    <Input placeholder="Search note..." onChange={e => onFilter && onFilter('note', e.target.value)} />
    <Button colorScheme="teal" onClick={() => onFilter && onFilter('reset')}>Reset</Button>
  </HStack>
);

export default ExpenseFilters; 