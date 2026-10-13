import { useState } from "react";

export default function useHook() {
  const [isLoading, setIsLoading] = useState(false);

  const firstCapital = (word: string) => (word ? word[0].toUpperCase() + word.slice(1) : word);

  return { isLoading, setIsLoading, firstCapital };
}
