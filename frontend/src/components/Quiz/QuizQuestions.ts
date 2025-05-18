// Question types
export type QuestionType = 'pictureSelection' | 'scale' | 'text' | 'dropdown' | 'multiSelect' | 'multipleChoice';

// Option interface for both question types
export interface QuestionOption {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  altText?: string;
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
    type: 'pictureSelection',
    number: 15,
    title: 'Ideal Home Images',
    description: 'Select up to 3 images that match your ideal home:',
    options: [
      { id: 1, name: '', imageUrl: '/images/Interiors/p1-modernColorfulMidcentury.png', altText: 'Mid-century modern living room with a curved rust-colored velvet sofa, teal accent wall, and large pleated fan wall art creating a warm, stylish atmosphere.' },
      { id: 2, name: 'Clean Modern Beige', imageUrl: '/images/Interiors/p2-cleanModernBeige.webp', altText: 'Minimalist living room with a curved cream sofa, abstract black-and-white wall art, sculptural floor lamp, and low round wooden coffee tables in soft natural lighting.' },
      { id: 3, name: 'Colorful Cheerful Spunky', imageUrl: '/images/Interiors/p3-ColorfulCheerfulSpunky.jpg', altText: 'Bright eclectic living space with yellow walls, colorful pillows, patterned rugs, and exposed wood beams creating a warm, lively, and inviting Southwestern atmosphere.' },
      { id: 4, name: 'Eccentric Personable Homey Messy', imageUrl: '/images/Interiors/p4-eccentricPersonableHomeyMessy.jpg', altText: 'Bohemian-style living room with turquoise walls, an ornate fireplace mantle, vibrant textiles, and layered decor featuring candles, flowers, and eclectic artwork.' },
      { id: 5, name: 'Colorful Modern Artsy', imageUrl: '/images/Interiors/p5-colorfulModernArtsy.jpg', altText: 'Contemporary living room with burgundy leather sectional sofa, geometric patterned pillows in bright colors, and a clean, white wall backdrop with neutral accents.' },
      { id: 6, name: 'Eccentric Bright Vibrant Earthy', imageUrl: '/images/Interiors/p6-eccentricBrightVibrantEarthy.jpg', altText: 'Modern dining room with a dark wood table, orange upholstered chairs, and large globe pendant lights, framed by floor-to-ceiling glass doors and patterned rug.' },
      { id: 7, name: 'Clean Airy Bright Modern', imageUrl: '/images/Interiors/p7-cleanAiryBrightModern.jpg', altText: 'Minimalist open-plan living room and kitchen with a soft beige sectional sofa, sleek white cabinetry, and natural light filling the space, creating a calm, airy vibe.' },
      { id: 8, name: 'Green Bright Airy', imageUrl: '/images/Interiors/p8-greenBrightAiry.avif', altText: 'A bright, cozy living space with green walls, large windows letting in natural light, and comfortable furniture arranged for relaxation.' },
      { id: 9, name: 'Classy Modern Clean', imageUrl: '/images/Interiors/p9-classyModernClean.jpg', altText: 'Bright dining room with a round white table, mix of black and white chairs, abstract artwork, and a fiddle leaf fig plant adding greenery to the modern decor.' },
      { id: 10, name: 'Soft Bright Homey', imageUrl: '/images/Interiors/p10-softBrightHomey.jpg', altText: 'Mid-century inspired living room with a textured cream sectional sofa, black triangular coffee table, and open kitchen in the background, styled with soft neutral tones and layered books and objects.' },
      { id: 11, name: 'Colorful Spunky Modern', imageUrl: '/images/Interiors/p11-colorfulSpunkyModern.jpg', altText: 'Sunlit living room filled with potted plants, colorful modern artwork, a gray sectional sofa, and warm wood furniture, blending mid-century and eclectic styles.' },
      { id: 12, name: 'Colorful Open Airy', imageUrl: '/images/Interiors/p12-colorfulOpenAiry.webp', altText: 'Spanish-inspired living room with arched windows, terracotta floors, a white sofa with bold pink and orange accent pillows. Ornate ceramic lamps on a carved wooden table give a rustic feel to the interior.' },
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
      { id: 1, name: 'Brights - Reds, yellows, blues', description: 'Brights - Reds, yellows, blues', imageUrl: '/images/colorpalettes/bright.png', altText: 'Brights - Reds, yellows, blues' },
      { id: 2, name: 'Neutrals - navy, gray, beige, tan', description: 'Neutrals - navy, gray, beige, tan', imageUrl: '/images/colorpalettes/neutrals.png', altText: 'Neutrals - navy, gray, beige, tan' },
      { id: 3, name: 'Subtle - cream, taupe, gray, burgundy', description: 'Subtle - cream, taupe, gray, burgundy', imageUrl: '/images/colorpalettes/subtle.png', altText: 'Subtle - cream, taupe, gray, burgundy' },
      { id: 4, name: 'Lights - pastels, pinks, pale blues, ivory, lavender', description: 'Lights - pastels, pinks, pale blues, ivory, lavender', imageUrl: '/images/colorpalettes/lights.png', altText: 'Lights - pastels, pinks, pale blues, ivory, lavender' },
      { id: 5, name: 'Daring - red, hot pink, black/white', description: 'Daring - red, hot pink, black/white', imageUrl: '/images/colorpalettes/daring.png', altText: 'Daring - red, hot pink, black/white' },
      { id: 6, name: 'Offbeat - mustard, plum, magenta', description: 'Offbeat - mustard, plum, magenta', imageUrl: '/images/colorpalettes/offbeat.png', altText: 'Offbeat - mustard, chartreuse, plum, magenta' },
      { id: 7, name: 'Contrasting - black, white, royal blue, red', description: 'Contrasting - black, white, royal blue, red', imageUrl: '/images/colorpalettes/contrasting.png', altText: 'Contrasting - black, white, royal blue, red' },
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
      { id: 2, name: '' },
      { id: 3, name: 'Soft Warm Glow' },
      { id: 4, name: '' },
      { id: 5, name: 'Low Light' },
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
      { id: 1, name: 'Cotton', description: 'Cotton', imageUrl: '/images/comfortmaterials/cotton.jpg', altText: 'A close-up of soft, beige cotton fabric with visible weave and natural folds.' },
      { id: 2, name: 'Velvet', description: 'Velvet', imageUrl: '/images/comfortmaterials/velvet.jpg', altText: 'Deep red velvet fabric with soft folds and a plush, rich texture.' },
      { id: 3, name: 'Leather', description: 'Leather', imageUrl: '/images/comfortmaterials/leather.jpg', altText: 'A close-up of worn brown leather showing natural grain and slight creases.' },
      { id: 4, name: 'Linen', description: 'Linen', imageUrl: '/images/comfortmaterials/linen.jpg', altText: 'Light beige linen draped across a surface, highlighting its coarse, natural texture.' },
      { id: 5, name: 'Faux Fur', description: 'Faux Fur', imageUrl: '/images/comfortmaterials/fauxfur.jpg', altText: 'A textured image of fluffy, teal faux fur with long, wavy strands.' },
      { id: 6, name: 'Reclaimed Wood', description: 'Reclaimed Wood', imageUrl: '/images/comfortmaterials/reclaimedwood.jpg', altText: 'A surface of weathered wooden planks with varied tones and rustic grain patterns.' },
      { id: 7, name: 'Stone', description: 'Stone', imageUrl: '/images/comfortmaterials/stone.jpg', altText: 'A close-up of a rough, gray stone texture with natural grooves and uneven patches.' },
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
      { id: 1, name: 'Stripes' , description: 'Stripes', imageUrl: '/images/patterns/stripes.jpg', altText: 'A pattern of alternating vertical black and white stripes.' },
      { id: 2, name: 'Polka Dots' , description: 'Polka Dots', imageUrl: '/images/patterns/polkadots.jpeg', altText: 'A playful pattern of red, blue, green, and yellow polka dots on a white background.' },
      { id: 3, name: 'Florals' , description: 'Florals', imageUrl: '/images/patterns/floral.jpg', altText: 'A delicate watercolor floral pattern with soft pastel flowers and green leaves on a white background.' },
      { id: 4, name: 'Geometric Shapes' , description: 'Geometric Shapes', imageUrl: '/images/patterns/geometricshapes.jpg', altText: 'A modern pattern of abstract geometric shapes in red, black, and white on a light background.' },
      { id: 5, name: 'No patterns' , description: 'No patterns', imageUrl: '/images/patterns/nopatterns.jpg', altText: 'No patterns' },
    ],
  },
  {
    id: 24,
    type: 'pictureSelection',
    number: 24,
    title: 'Artwork',
    description: 'What type of artwork speaks to you?',
    options: [
        { id: 1, name: 'Abstract art' , description: 'Abstract art', imageUrl: '/images/artworks/abstract.jpg', altText: 'A colorful abstract painting with bold brushstrokes in blue, red, white, and orange tones.' },
        { id: 2, name: 'Nature scenes' , description: 'Nature scenes', imageUrl: '/images/artworks/nature.jpg', altText: 'A serene landscape painting of a lush green forest surrounding a calm river or pond.' },
        { id: 3, name: 'Photos' , description: 'Photos', imageUrl: '/images/artworks/photos.jpg', altText: 'A black-and-white photo of a smiling family of three in a white frame, placed on a wooden surface.' },
        { id: 4, name: 'Culturally relevant art styles' , description: 'Culturally relevant styles', imageUrl: '/images/artworks/culturallyrelevantart.jpg', altText: 'A digital illustration of a woman in profile wearing a patterned headwrap and beaded necklace, with vibrant wavy lines in red, green, and yellow.' },
        { id: 5, name: 'Unsure' , description: 'Unsure', imageUrl: '/images/artworks/unsure.jpg', altText: 'Unsure' }, 
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