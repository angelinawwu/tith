// Question types
export type QuestionType = 'style' | 'texture' | 'text';

// Option interface for both question types
export interface QuestionOption {
  id: number;
  name: string;
  description?: string;
}

// Question interface
export interface Question {
  id: number;
  type: QuestionType;
  number: number;
  title: string;
  description: string;
  options: QuestionOption[];
  placeholder?: string;
  inputType?: string;
}

// Quiz questions data
const quizQuestions: Question[] = [
  {
    id: 1,
    type: 'style',
    number: 1,
    title: 'Interior Style',
    description: 'Choose the style(s) that best describe your personal preference.',
    options: [
      { id: 1, name: 'Modern', description: 'Clean lines and minimal decoration' },
      { id: 2, name: 'Traditional', description: 'Classic design with warm colors' },
      { id: 3, name: 'Contemporary', description: 'Blend of modern and traditional' },
    ]
  },
  {
    id: 2,
    type: 'texture',
    number: 2,
    title: 'Fabric Texture',
    description: 'What texture do you prefer in cloth?',
    options: [
      { id: 1, name: 'Rough' },
      { id: 2, name: 'Slightly Rough' },
      { id: 3, name: 'Medium' },
      { id: 4, name: 'Slightly Soft' },
      { id: 5, name: 'Soft' },
    ]
  },
  {
    id: 3,
    type: 'text',
    number: 3,
    title: 'Your Name',
    description: 'Please enter your full name',
    options: [],
    placeholder: 'e.g., John Smith',
    inputType: 'text'
  },
  {
    id: 4,
    type: 'text',
    number: 4,
    title: 'Phone Number',
    description: 'Please enter your phone number',
    options: [],
    placeholder: 'e.g., (555) 123-4567',
    inputType: 'tel'
  },
  {
    id: 5,
    type: 'text',
    number: 5,
    title: 'Email Address',
    description: 'Please enter your email address',
    options: [],
    placeholder: 'e.g., name@example.com',
    inputType: 'email'
  }
];

export default quizQuestions; 