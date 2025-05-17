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
    id: 6,
    type: 'dropdown',
    number: 6,
    title: 'Household Size',
    description: 'Household Size',
    options: [
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
      { id: 4, name: '4+' },
    ],
  },
  {
    id: 7,
    type: 'dropdown',
    number: 7,
    title: 'Foster Care Experience',
    description: 'Have you ever been placed in Foster Care?',
    options: [
      { id: 1, name: 'Yes' },
      { id: 2, name: 'No' },
      { id: 3, name: 'Prefer not to say' },
    ],
  },
  {
    id: 8,
    type: 'dropdown',
    number: 8,
    title: 'Disability Status',
    description: 'Do you experience any type of disability?',
    options: [
      { id: 1, name: 'Yes' },
      { id: 2, name: 'No' },
      { id: 3, name: 'Prefer not to say' },
    ],
  },
  {
    id: 9,
    type: 'text',
    number: 9,
    title: 'Disability Type',
    description: 'If you answered yes to the answer above, please let us know which disability/disabilities, so we can best accommodate you.',
    options: [],
    inputType: 'text'
  },
  {
    id: 10,
    type: 'multiSelect',
    number: 10,
    title: 'Message',
    description: 'What message would you like your home to communicate?',
    options: [
      { id: 1, name: 'Warm and welcoming' },
      { id: 2, name: 'Elegant, stately, and refined' },
      { id: 3, name: 'Unconventional, artistic, and original' },
      { id: 4, name: 'Minimal and businesslike' },
      { id: 5, name: 'Glamorous and luxurious' },
      { id: 6, name: 'Casual and comfortable' },
      { id: 7, name: 'Prefer not to say' },
    ],
  },
  {
    id: 11,
    type: 'pictureSelection',
    number: 11,
    title: 'Favorite Colors',
    description: 'What are your favorite colors?',
    options: [
      { id: 1, name: 'Brights - Reds, yellows, blues' },
      { id: 2, name: 'Neutrals - navy, gray, beige, tan' },
      { id: 3, name: 'Subtle - cream, taupe, gray, burgundy' },
      { id: 4, name: 'Lights - pastels, pinks, pale blues, ivory, lavender' },
      { id: 5, name: 'Daring - red, hot pink, black/white' },
      { id: 6, name: 'Offbeat - mustard, chartreuse, plum, magenta' },
      { id: 7, name: 'Contrasting - black, white, royal blue, red' },
      { id: 8, name: 'Prefer not to say' },
    ]
  },
  {
    id: 12,
    type: 'scale',
    number: 12,
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