// src/quizConfig.js
export const quizConfig = [
    {
      id: "firstName",
      label: "First Name",
      type: "text"
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text"
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      type: "text"
    },
    {
      id: "email",
      label: "E-mail",
      type: "email"
    },
    {
      id: "gender",
      label: "Gender",
      type: "dropdown",
      options: ["Nonbinary", "Trans", "Female", "Male", "Prefer not to answer"]
    },
    {
      id: "ethnicity",
      label: "Ethnicity",
      type: "dropdown",
      options: [
        "Latinx/Hispanic", "Black/African American", "Pacific Islander", 
        "Asian", "Caucasian", "Indigenous/Native American", "Prefer not to answer"
      ]
    },
    {
      id: "householdSize",
      label: "Household Size",
      type: "dropdown",
      options: ["1", "2", "3", "4+"]
    },
    {
      id: "fosterCare",
      label: "Have you ever been placed in Foster Care?",
      type: "dropdown",
      options: ["Yes", "No"]
    },
    {
      id: "disability",
      label: "Do you experience any type of disability?",
      type: "dropdown",
      options: ["Yes", "No"]
    },
    {
      id: "disabilityDetails",
      label: "If yes, please list your disability/disabilities",
      type: "textarea"
    },
    {
      id: "homeMessage",
      label: "What message would you like your home to communicate?",
      type: "checkbox",
      options: [
        "Warmth & welcoming", "Elegant, stately, & refined",
        "Unconventional, artistic, original", "Minimal & businesslike",
        "Glamorous", "Casual"
      ]
    },
    {
      id: "favoriteColors",
      label: "What are your favorite colors?",
      type: "checkbox",
      options: [
        "Brights - Reds, yellows, blues",
        "Neutrals - navy, gray, beige, tan",
        "Subtle - cream, taupe, gray, burgundy",
        "Lights - pastels, pinks, pale blues, ivory, lavender",
        "Daring - red, hot pink, black/white",
        "Offbeat - mustard, chartreuse, plum, magenta",
        "Contrasting - black, white, royal blue, red"
      ]
    },
    {
      id: "styleInWords",
      label: "Describe your style in three words.",
      type: "text"
    },
    {
      id: "styleAdmired",
      label: "Whose style do you admire and why?",
      type: "textarea"
    },
    {
      id: "peacePlace",
      label: "Where do you feel most at peace?",
      type: "text"
    },
    {
      id: "peaceScent",
      label: "What scent brings you peace?",
      type: "checkbox",
      options: ["Fresh linen", "Lavender", "Eucalyptus", "Vanilla", "Citrus", "No scent"]
    },
    {
      id: "fabrics",
      label: "Which fabrics feel best for you?",
      type: "checkbox",
      options: ["Cotton", "Velvet", "Leather", "Linen"]
    },
    {
      id: "calmColors",
      label: "What colors bring calm/comfort?",
      type: "checkbox",
      options: [
        "earth tones i.e greens, browns, etc.",
        "warm neutrals. white, grays, browns, etc.",
        "muted blues i.e ocean, sky blue etc.",
        "Yellows"
      ]
    },
    {
      id: "artTypes",
      label: "What type of artwork speaks to you?",
      type: "checkbox",
      options: ["Abstract art", "Nature scenes", "Photos", "Culturally relevant art styles"]
    },
    {
      id: "allergies",
      label: "Are you allergic to any scents, plants, or fabrics?",
      type: "dropdown",
      options: ["Yes", "No"]
    },
    {
      id: "allergyDetails",
      label: "If allergic, please explain.",
      type: "textarea"
    },
    {
      id: "pets",
      label: "Do you have any pets?",
      type: "dropdown",
      options: ["Yes", "No"]
    },
    {
      id: "petDetails",
      label: "If yes, describe them.",
      type: "textarea"
    },
    {
      id: "spaceWord",
      label: "When thinking of your space, what's one word that comes to mind?",
      type: "checkbox",
      options: ["Calm", "Joyful", "Safe", "Private"]
    },
    {
      id: "dislikedTexturesColors",
      label: "Any textures/colors you dislike?",
      type: "textarea"
    },
    {
      id: "soothingSounds",
      label: "What sounds help you feel grounded?",
      type: "checkbox",
      options: ["Light Music", "Ocean/nature sounds", "Silence", "Favorite songs"]
    },
    {
      id: "relaxationActivities",
      label: "What's your favorite way to relax at home?",
      type: "checkbox",
      options: ["Watching a good TV show", "Reading", "Being around others", "Board games with friends"]
    },
    {
      id: "favoriteMusic",
      label: "What type of music brings you joy?",
      type: "checkbox",
      options: ["R&B/Soul", "Latin", "Jazz", "Hip Hop", "Rock", "Pop", "Classical", "Other"]
    },
    {
      id: "favoriteMovie",
      label: "What's your favorite movie?",
      type: "text"
    },
    {
      id: "joySongs",
      label: "What 3 songs evoke pure joy?",
      type: "textarea"
    },
    {
      id: "patternPreference",
      label: "How do you feel about patterns?",
      type: "radio",
      options: [
        "Love them, they add energy",
        "Some are fine, but not too much",
        "I prefer no patterns, just solid colors"
      ]
    },
    {
      id: "patternTypes",
      label: "What patterns do you like?",
      type: "checkbox",
      options: ["Stripes", "Polka Dots", "Florals", "Geometric Shapes", "No patterns"]
    },
    {
      id: "roomWords",
      label: "Words that describe your ideal room (pick up to 3)",
      type: "checkbox",
      options: ["Cozy", "Minimal", "Colorful", "Organized", "Vibrant", "Peaceful"]
    },
    {
      id: "finalNotes",
      label: "Anything else you'd like to share?",
      type: "textarea"
    }
  ];
  