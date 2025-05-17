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
  required?: boolean;
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
    inputType: 'name'
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
    type: 'text',
    number: 12,
    title: 'Style Description',
    description: 'Describe your style in three words.',
    options: [],
    inputType: 'text'
  },
  {
    id: 13,
    type: 'text',
    number: 13,
    title: 'Style Inspiration',
    description: 'Whose style do you admire? ( friend, celebrity, etc.) What is it about their style that you admire?',
    options: [],
    inputType: 'text'
  },
  {
    id: 14,
    type: 'text',
    number: 14,
    title: 'Favorite Place',
    description: 'Where do you feel the most at peace?',
    options: [],
    inputType: 'text'
  },
  {
    id: 15,
    type: 'multiSelect',
    number: 15,
    title: 'Favorite Scent',
    description: 'Is there a smell or scent that brings you peace?',
    options: [
      { id: 1, name: 'No Scent' },
      { id: 2, name: 'Sweet' },
      { id: 3, name: 'Citrus' },
      { id: 4, name: 'Floral' },
      { id: 5, name: 'Spicy' },
      { id: 6, name: 'Woodsy' },
      { id: 7, name: 'Clean' },
    ],
  },
  {
    id: 16,
    type: 'scale',
    number: 16,
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
    // NOTE: Add pictures for each option
    id: 17,
    type: 'pictureSelection',
    number: 17,
    title: 'Calming Colors',
    description: 'What colors bring a sense of calm or comfort for you?',
    options: [
        { id: 1, name: 'Earth tones' },
        { id: 2, name: 'Warm neutrals' },
        { id: 3, name: 'Muted blues' },
        { id: 4, name: 'Yellows' },
        { id: 5, name: 'Pastels' },
        { id: 6, name: 'Vibrant colors' },
    ],
  },
  {
    id: 18,
    type: 'pictureSelection',
    number: 18,
    title: 'Artwork',
    description: 'What type of artwork speaks to you?',
    options: [
        { id: 1, name: 'Abstract art' },
        { id: 2, name: 'Nature scenes' },
        { id: 3, name: 'Photos' },
        { id: 4, name: 'Culturally relevant art styles' },
        { id: 5, name: 'Unsure' },
    ],
  },
  {
    id: 19,
    type: 'dropdown',
    number: 19,
    title: 'Allergies',
    description: 'Are you allergic to any scents, plants, or fabrics?',
    options: [
        { id: 1, name: 'Yes' },
        { id: 2, name: 'No' },
    ],
  },
  {
    id: 20,
    type: 'text',
    number: 20,
    title: 'Allergy Information',
    description: 'If allergic to any of these items listed above, please explain.',
    options: [],
    inputType: 'text'
  },
  {
    id: 21,
    type: 'dropdown',
    number: 21,
    title: 'Pets',
    description: 'Do you have any pets?',
    options: [
        { id: 1, name: 'Yes' },
        { id: 2, name: 'No' },
    ],
  },
  {
    id: 22,
    type: 'text',
    number: 22,
    title: 'Pets Information',
    description: 'If you have any pets, please explain what type and how many',
    options: [],
    inputType: 'text'
  },
  {
    id: 23,
    type: 'multiSelect',
    number: 23,
    title: 'One Word Description',
    description: 'When thinking about your new space, what is the one word that comes to mind?',
    options: [
        { id: 1, name: 'Calm' },
        { id: 2, name: 'Joyful' },
        { id: 3, name: 'Safe' },
        { id: 4, name: 'Private' },
        { id: 5, name: 'Cozy' },
        { id: 6, name: 'Prefer not to say' },
    ],
  },
  {
    id: 24,
    type: 'text',
    number: 24,
    title: 'Triggers',
    description: 'Are there any textures or colors that you don\'t like or may bring up difficult memories for you?',
    options: [],
    inputType: 'text'
  },
  {
    id: 25,
    type: 'multiSelect',
    number: 25,
    title: 'Favorite Sounds',
    description: 'What sounds help you feel grounded or at peace?',
    options: [
        { id: 1, name: 'Light Music' },
        { id: 2, name: 'Ocean/nature sounds' },
        { id: 3, name: 'Silence' },
        { id: 4, name: 'Favorite songs' },
        { id: 5, name: 'Prefer not to say' },
    ],
  },
  {
    id: 26,
    type: 'text',
    number: 26,
    title: 'Favorite Way to Relax',
    description: 'What\'s your favorite way to relax at home?',
    options: [
        { id: 1, name: 'Watching a good TV show' },
        { id: 2, name: 'Reading' },
        { id: 3, name: 'Being around others' },
        { id: 4, name: 'Playing board games with friends' },
        { id: 5, name: 'Prefer not to say' },
    ],
    inputType: 'text'
  }
];

export default quizQuestions; 