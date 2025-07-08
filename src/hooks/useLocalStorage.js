import { useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  return [value, setValue];
} 