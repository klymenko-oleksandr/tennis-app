import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen', // Removes the default padding/margin wrapper
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#F8F8F5' },
        { name: 'surface', value: '#FFFFFF' },
        { name: 'dark-surface', value: '#1C1B17' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
