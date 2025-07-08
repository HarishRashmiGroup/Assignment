import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Text } from '@chakra-ui/react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message = '', confirmText = 'Confirm', cancelText = 'Cancel' }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>{message}</Text>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="teal" mr={3} onClick={onConfirm}>{confirmText}</Button>
        <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ConfirmDialog; 