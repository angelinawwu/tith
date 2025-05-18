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
      { id: 1, name: 'Latinx/Hispanic' },
      { id: 2, name: 'Black/African American' },
      { id: 3, name: 'Pacific Islander' },
      { id: 4, name: 'Asian' },
      { id: 5, name: 'Caucasian' },
      { id: 6, name: 'Indigenous/Native American' },
      { id: 7, name: 'Prefer not to answer' },
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
    title: 'Children in Household',
    description: 'How many children will you be living with (if any)?',
    options: [
      { id: 1, name: '0' },
      { id: 2, name: '1' },
      { id: 3, name: '2' },
      { id: 4, name: '3+' },
    ],
  },
  {
    id: 8,
    type: 'dropdown',
    number: 8,
    title: 'Pets in Household',
    description: 'Do you have any pets?',
    options: [
      { id: 1, name: 'Yes' },
      { id: 2, name: 'No' },
    ],
  },
  {
    id: 9,
    type: 'text',
    number: 9,
    title: 'Pets Information',
    description: 'If yes, please list type(s) and how many:',
    options: [],
    inputType: 'text'
  },
  {
    id: 10,
    type: 'dropdown',
    number: 10,
    title: 'Foster Care Experience',
    description: 'Have you ever been placed in Foster Care?',
    options: [
      { id: 1, name: 'Yes' },
      { id: 2, name: 'No' },
      { id: 3, name: 'Prefer not to say' },
    ],
  },
  {
    id: 11,
    type: 'dropdown',
    number: 11,
    title: 'Disability Status',
    description: 'Does anyone in your household experience any type of disability?',
    options: [
      { id: 1, name: 'Yes' },
      { id: 2, name: 'No' },
      { id: 3, name: 'Prefer not to say' },
    ],
  },
  {
    id: 12,
    type: 'text',
    number: 12,
    title: 'Disability Type',
    description: 'If yes, please describe any accessibility needs or accommodations that would help your household (e.g., low furniture, non-slip rugs, quiet appliances):',
    options: [],
    inputType: 'text'
  },
  {
    id: 13,
    type: 'dropdown',
    number: 13,
    title: 'Allergies',
    description: 'Are you allergic to any scents, plants, or fabrics?',
    options: [
        { id: 1, name: 'Yes' },
        { id: 2, name: 'No' },
    ],
  },
  {
    id: 14,
    type: 'text',
    number: 14,
    title: 'Allergy Information',
    description: 'If yes, please describe your allergies:',
    options: [],
    inputType: 'text'
  },
  {
    id: 15,
    type: 'multiSelect',
    number: 15,
    title: 'Ideal Home Images',
    description: 'Select up to 3 images that match your ideal home:',
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
    id: 16,
    type: 'multiSelect',
    number: 16,
    title: 'Word Description',
    description: 'When thinking about your new space, what words come to mind?',
    options: [
        { id: 1, name: 'Calm' },
        { id: 2, name: 'Joyful' },
        { id: 3, name: 'Safe' },
        { id: 4, name: 'Private' },
    ],
  },
  {
    id: 17,
    type: 'multiSelect',
    number: 17,
    title: 'Ideal Room',
    description: 'What words best describe your ideal room?',
    options: [
        { id: 1, name: 'Cozy' },
        { id: 2, name: 'Minimal' },
        { id: 3, name: 'Colorful' },
        { id: 4, name: 'Organized' },
        { id: 5, name: 'Vibrant' },
        { id: 6, name: 'Peaceful' },
    ],
  },
  {
    id: 18,
    type: 'pictureSelection',
    number: 18,
    title: 'Comfort Colors',
    description: 'What colors bring a sense of calm or comfort to you?',
    options: [
      { id: 1, name: 'Brights - Reds, yellows, blues' },
      { id: 2, name: 'Neutrals - navy, gray, beige, tan' },
      { id: 3, name: 'Subtle - cream, taupe, gray, burgundy' },
      { id: 4, name: 'Lights - pastels, pinks, pale blues, ivory, lavender' },
      { id: 5, name: 'Daring - red, hot pink, black/white' },
      { id: 6, name: 'Offbeat - mustard, chartreuse, plum, magenta' },
      { id: 7, name: 'Contrasting - black, white, royal blue, red' },
    ]
  },
  {
    id: 19,
    type: 'scale',
    number: 19,
    title: 'Lighting',
    description: 'What kind of light environment do you prefer?',
    options: [
      { id: 1, name: 'Bright Daylight' },
      { id: 2, name: 'Soft Warm Glow' },
      { id: 3, name: 'Low Light' },
    ],
  },
  {
    id: 20,
    type: 'multiSelect',
    number: 20,
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
    id: 21,
    type: 'pictureSelection',
    number: 21,
    title: 'Comfort Materials',
    description: 'Choose up to 3 materials that bring you comfort:',
    options: [
      { id: 1, name: 'Cotton' },
      { id: 2, name: 'Velvet' },
      { id: 3, name: 'Leather' },
      { id: 4, name: 'Linen' },
      { id: 5, name: 'Faux Fur' },
      { id: 6, name: 'Reclaimed Wood' },
      { id: 7, name: 'Stone' },
    ],
  },
  {
    id: 22,
    type: 'multipleChoice',
    number: 22,
    title: 'Patterns',
    description: 'How do you feel about patterns in your space?',
    options: [
      { id: 1, name: 'Love them, they add energy' },
      { id: 2, name: 'Some are fine, but not too much' },
      { id: 3, name: 'I prefer no patterns, just solid colors' },
    ],
  },
  {
    id: 23,
    type: 'pictureSelection',
    number: 23,
    title: 'Patterns Details',
    description: 'What patterns do you like?',
    options: [
      { id: 1, name: 'Stripes' },
      { id: 2, name: 'Polka Dots' },
      { id: 3, name: 'Florals' },
      { id: 4, name: 'Geometric Shapes' },
      { id: 5, name: 'No patterns' },
    ],
  },
  {
    id: 24,
    type: 'pictureSelection',
    number: 24,
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
    ],
  },
  {
    id: 26,
    type: 'text',
    number: 26,
    title: 'Favorite Songs',
    description: 'Are there any songs or genres that evoke pure joy for you?',
    options: [],
    inputType: 'text'
  },
  {
    id: 27,
    type: 'text',
    number: 27,
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
  },
  {
    id: 28,
    type: 'multiSelect',
    number: 28,
    title: 'Spiritual or Religious Elements',
    description: 'Are there any spiritual or religious elements you\'d like reflected in your home?',
    options: [
      { id: 1, name: 'Prayer space' },
      { id: 2, name: 'Altar' },
      { id: 3, name: 'Incense area' },
      { id: 4, name: 'Other' },
    ],
  },
  {
    id: 29,
    type: 'multiSelect',
    number: 29,
    title: 'Triggers',
    description: 'Are there any sights, sounds, or materials that make you feel overwhelmed, anxious, or unsafe?',
    options: [
      { id: 1, name: 'Fluorescent lighting' },
      { id: 2, name: 'Metal surfaces' },
      { id: 3, name: 'Clutter' },
      { id: 4, name: 'Loud patterns' },
      { id: 5, name: 'Other' },
    ],
  },
  {
    id: 30,
    type: 'text',
    number: 30,
    title: 'Other Triggers',
    description: 'Is there anything else you\'d like to share about your preferences or things you\'d like to avoid in your new home?',  
    options: [],
    inputType: 'text'
  },
];

export default quizQuestions; 