export interface StepProps<T> {
  onComplete: (data: T) => void;
}