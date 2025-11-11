import { defineConfig } from 'cypress';
import initPlugin from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      return config;
    },
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
    supportFile: 'cypress/support/component.ts',
  },
  video: true,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
});