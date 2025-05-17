// Quiz component styles

export const styles = {
  quizContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },

  questionSection: {
    marginBottom: '2.5rem',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
  },

  questionNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    backgroundColor: '#6b705c',
    color: 'white',
    borderRadius: '50%',
    marginRight: '0.75rem',
    fontSize: '1rem',
  },

  styleOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },

  styleOption: {
    border: '2px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },

  styleOptionSelected: {
    borderColor: '#6b705c',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },

  styleLabel: {
    cursor: 'pointer',
    display: 'block',
  },

  styleImage: {
    height: '150px',
    backgroundColor: '#e9edc9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    color: '#6b705c',
    fontWeight: 500,
  },

  styleInfo: {
    padding: '1rem',
  },

  styleInfoHeading: {
    margin: '0 0 0.5rem',
  },

  styleInfoParagraph: {
    margin: '0',
    fontSize: '0.9rem',
    color: '#666',
  },

  visuallyHidden: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: '0',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    border: '0',
  },

  textureSliderContainer: {
    marginTop: '1.5rem',
  },

  textureLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },

  textureSlider: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#e9edc9',
    height: '4rem',
    borderRadius: '2rem',
    position: 'relative' as const,
    margin: '1rem 0',
  },

  textureOption: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textureButton: {
    display: 'block',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    backgroundColor: '#ddd',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  textureButtonSelected: {
    backgroundColor: '#6b705c',
    transform: 'scale(1.2)',
  },

  submitContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
  },

  submitButton: {
    backgroundColor: '#6b705c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },

  submitButtonHover: {
    backgroundColor: '#5a5f4d',
  },

  submitButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};

export default styles; 