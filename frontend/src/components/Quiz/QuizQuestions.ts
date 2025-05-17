// Question types
export type QuestionType = 'pictureSelection' | 'scale' | 'text' | 'dropdown' | 'multiSelect' | 'multipleChoice';

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
    type: 'text',
    number: 1,
    title: 'Name',
    description: 'Full Name',
    options: [],
    placeholder: 'e.g., John Smith',
    inputType: 'text'
  },
  {
    id: 2,
    type: 'text',
    number: 2,
    title: 'Phone Number',
    description: 'Phone Number',
    options: [],
    placeholder: 'e.g., (555) 123-4567',
    inputType: 'tel'
  },
  {
    id: 3,
    type: 'text',
    number: 3,
    title: 'Email Address',
    description: 'Email Address',
    options: [],
    placeholder: 'e.g., name@example.com',
    inputType: 'email'
  },
  {
    id: 4,
    type: 'multiSelect',
    number: 4,
    title: 'Gender',
    description: 'Gender (select all that apply)',
    options: [
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
      { id: 3, name: 'Transgender' },
      { id: 4, name: 'Non-binary' },
      { id: 5, name: 'Prefer not to say' },
    ],
  },
  {
    id: 5,
    type: 'multiSelect',
    number: 5,
    title: 'Ethnicity',
    description: 'Ethnicity (select all that apply)',
    options: [
      { id: 1, name: 'Asian' },
      { id: 2, name: 'Black/African American' },
      { id: 3, name: 'Latinx/Hispanic' },
      { id: 4, name: 'Middle Eastern' },
      { id: 5, name: 'Indigenous/Native American or Alaska Native' },
      { id: 6, name: 'Native Hawaiian or Other Pacific Islander' },
      { id: 7, name: 'White' },
      { id: 8, name: 'Mixed Race' },
      { id: 9, name: 'Unknown/Prefer not to say' },
    ],
  },
  {
    id: 12,
    type: 'pictureSelection',
    number: 12,
    title: 'Interior Style',
    description: 'Choose the style(s) that best describe your personal preference.',
    options: [
      { id: 1, name: 'Modern', description: 'Clean lines and minimal decoration' },
      { id: 2, name: 'Traditional', description: 'Classic design with warm colors' },
      { id: 3, name: 'Contemporary', description: 'Blend of modern and traditional' },
    ]
  },
  {
    id: 13,
    type: 'scale',
    number: 13,
    title: 'Fabric Texture',
    description: 'What texture do you prefer in cloth?',
    options: [
      { id: 1, name: 'Rough' },
      { id: 2, name: 'Slightly Rough' },
      { id: 3, name: 'Medium' },
      { id: 4, name: 'Slightly Soft' },
      { id: 5, name: 'Soft' },
    ]
  }
];

export default quizQuestions; 