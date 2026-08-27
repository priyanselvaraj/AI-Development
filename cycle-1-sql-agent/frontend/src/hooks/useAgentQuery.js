import { useState, useCallback } from 'react';
import apiService from '../services/api';

export function useAgentQuery() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(null); // 'PERCEIVE', 'PLAN', 'ACT', 'OBSERVE', 'DONE'

  const executeQuery = useCallback(async (question, simulateError = false) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep('PERCEIVE');

    // Simulate subtle visual progression for high UX responsiveness
    const stepTimer1 = setTimeout(() => setCurrentStep('PLAN'), 400);
    const stepTimer2 = setTimeout(() => setCurrentStep('ACT'), 800);
    const stepTimer3 = setTimeout(() => setCurrentStep('OBSERVE'), 1200);

    try {
      const data = await apiService.runQuery({
        question,
        simulate_initial_error: simulateError,
        max_iterations: 5,
      });
      setResult(data);
      setCurrentStep('DONE');
      return data;
    } catch (err) {
      setError(err.message);
      setCurrentStep('ERROR');
      throw err;
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setCurrentStep(null);
  }, []);

  return {
    loading,
    result,
    error,
    currentStep,
    executeQuery,
    reset,
  };
}
