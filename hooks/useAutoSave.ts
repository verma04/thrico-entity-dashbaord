import { useCallback, useRef, useEffect } from 'react';
import { useToast } from './use-toast';

interface UseAutoSaveOptions<T> {
  onSave: (data: T) => Promise<void>;
  delay?: number;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

/**
 * Custom hook for debounced auto-save functionality
 * @param options - Configuration options for auto-save
 * @returns Object containing the debounced save function and loading state
 */
export function useAutoSave<T>({
  onSave,
  delay = 2000,
  onError,
  onSuccess,
}: UseAutoSaveOptions<T>) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedSave = useCallback(
    (data: T) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced save
      timeoutRef.current = setTimeout(async () => {
        if (isSavingRef.current) {
          // Already saving, skip this call
          return;
        }

        try {
          isSavingRef.current = true;
          await onSave(data);
          
          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
          
          toast({
            title: 'Auto-save failed',
            description: 'Your changes are saved locally but not synced to the server. Please try again.',
            variant: 'destructive',
          });

          if (onError && error instanceof Error) {
            onError(error);
          }
        } finally {
          isSavingRef.current = false;
        }
      }, delay);
    },
    [onSave, delay, onError, onSuccess, toast]
  );

  return {
    debouncedSave,
    isSaving: isSavingRef.current,
  };
}
