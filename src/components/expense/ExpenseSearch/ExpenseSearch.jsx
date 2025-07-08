import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const ExpenseSearch = ({ onSearch }) => (
  <InputGroup mb={4}>
    <InputLeftElement pointerEvents="none">
      <SearchIcon color="gray.400" />
    </InputLeftElement>
    <Input placeholder="Search expenses..." onChange={e => onSearch && onSearch(e.target.value)} />
  </InputGroup>
);

export default ExpenseSearch; 