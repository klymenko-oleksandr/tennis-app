import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {
      builder: {
        viteConfigPath: 'vite.config.mts',
      },
    },
  },
  // Safety net: the referenced vite.config.mts already sets server.fs.allow
  // to the repo root, but Storybook's builder-vite doesn't reliably keep a
  // relative fs.allow entry from that file across its own config merge.
  // Setting it again here, absolute, guarantees self-hosted font files
  // under node_modules aren't 403'd regardless of merge order.
  async viteFinal(config) {
    config.server = {
      ...config.server,
      fs: {
        ...config.server?.fs,
        allow: [...(config.server?.fs?.allow ?? []), repoRoot],
      },
    };
    return config;
  },
};

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
