/**
 * HVAC Quick Check questions — short 2-3 question comprehension checks
 * shown inline on lesson pages after the main content.
 *
 * Keyed by lesson definition ID (e.g. 'hvac-01-01').
 * Returns null/undefined for lessons without a quick check.
 */

import { type QuizQuestion } from './hvac-quizzes';

export const HVAC_QUICK_CHECKS: Record<string, QuizQuestion[]> = {
  'hvac-01-01': [
    {
      id: 'qc-01-01-1',
      question: 'What federal certification is required to legally purchase or handle refrigerants?',
      options: ['OSHA 10', 'EPA 608', 'NATE', 'ETPL'],
      correctAnswer: 1,
      explanation: 'EPA 608 certification is required by the Clean Air Act to purchase or handle any refrigerant.',
    },
    {
      id: 'qc-01-01-2',
      question: 'What is the minimum attendance requirement to maintain WIOA funding?',
      options: ['60%', '70%', '80%', '90%'],
      correctAnswer: 2,
      explanation: 'An 80% attendance rate is required to maintain WIOA workforce funding.',
    },
  ],
  'hvac-02-01': [
    {
      id: 'qc-02-01-1',
      question: 'What does HVAC stand for?',
      options: [
        'Heating, Ventilation, and Air Conditioning',
        'High Voltage Alternating Current',
        'Heating, Venting, and Cooling',
        'Home Ventilation and Climate Control',
      ],
      correctAnswer: 0,
      explanation: 'HVAC stands for Heating, Ventilation, and Air Conditioning.',
    },
  ],
  'hvac-07-01': [
    {
      id: 'qc-07-01-1',
      question: 'Which law requires EPA 608 certification for refrigerant handling?',
      options: ['OSHA Act', 'Clean Air Act', 'Clean Water Act', 'Energy Policy Act'],
      correctAnswer: 1,
      explanation: 'The Clean Air Act (Section 608) requires certification for anyone who purchases or handles refrigerants.',
    },
  ],
};
