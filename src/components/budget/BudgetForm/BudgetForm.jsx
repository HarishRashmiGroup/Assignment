import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const BudgetForm = ({
  isOpen,
  onClose,
  year,
  month,
  onSubmit,
  categories,
  selectedCategory,
  existingBudgets
}) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Set initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (selectedCategory) {
        setCategoryId(selectedCategory.id);
        const existingBudget = existingBudgets?.find(
          budget => budget.categoryId === selectedCategory.id
        );
        setAmount(existingBudget?.amount || '');
      } else {
        setCategoryId('');
        setAmount('');
      }
    }
  }, [isOpen, selectedCategory, existingBudgets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && amount && categoryId) {
      onSubmit({
        amount: parseFloat(amount),
        categoryId,
        category: selectedCategory?.name ?? categories.find((cat) => cat.id === categoryId)?.name ?? 'Others',
        month,
        year
      });
      setAmount('');
      setCategoryId('');
      onClose();
    }
  };

  const handleClose = () => {
    setAmount('');
    setCategoryId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {selectedCategory ? 'Edit Budget' : 'Set Budget'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="category" isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  placeholder="Select a category"
                  isDisabled={!!selectedCategory}
                >
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl id="amount" isRequired>
                <FormLabel>Budget Amount</FormLabel>
                <Input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter budget amount"
                  min="0"
                  step="0.01"
                />
              </FormControl>

              <Button
                colorScheme="teal"
                type="submit"
                w="full"
                isDisabled={!amount || !categoryId}
              >
                {selectedCategory ? 'Update Budget' : 'Set Budget'}
              </Button>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BudgetForm;