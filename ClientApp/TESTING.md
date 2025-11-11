# Testing Documentation

This document provides comprehensive information about the testing setup, coverage analysis, and best practices for the Community Car Client Application.

## Overview

The application uses a comprehensive testing strategy with both unit tests and end-to-end (E2E) tests to ensure code quality and reliability.

## Testing Stack

- **Unit Testing**: Angular Karma + Jasmine
- **E2E Testing**: Cypress with code coverage
- **Coverage Reporting**: Istanbul (nyc) for E2E, Karma Coverage for unit tests

## Project Structure

```
cypress/
├── e2e/                 # E2E test files
├── fixtures/           # Test data fixtures
├── support/            # Cypress support files
└── config.ts           # Cypress configuration

src/
├── **/*.spec.ts        # Unit test files
└── **/*.cy.ts          # Component test files
```

## Running Tests

### Unit Tests

```bash
# Run unit tests once
npm run test:ci

# Run unit tests with coverage
ng test --watch=false --browsers=ChromeHeadless --code-coverage

# Run unit tests in watch mode
npm test
```

### E2E Tests

```bash
# Run E2E tests
npm run cy:run

# Run E2E tests with coverage
npm run e2e:coverage

# Open Cypress Test Runner
npm run cy:open
```

### Component Tests

```bash
# Run component tests
npx cypress run --component
```

## Coverage Analysis

### Unit Test Coverage

Coverage reports are generated in the `coverage/` directory after running unit tests with the `--code-coverage` flag.

### E2E Test Coverage

E2E coverage is configured using `@cypress/code-coverage` and reports are generated in `coverage/e2e/`.

### Coverage Configuration

- **Unit Tests**: Configured in `angular.json` and `karma.conf.js`
- **E2E Tests**: Configured in `.nycrc.json` and `cypress.config.ts`

## Test Organization

### Unit Tests

- Located alongside the code they test with `.spec.ts` extension
- Follow the naming convention: `component.service.spec.ts`
- Use Jasmine framework with Angular Testing Utilities

### E2E Tests

- Located in `cypress/e2e/` directory
- Use descriptive names like `app.cy.ts`
- Test complete user workflows and critical paths

### Component Tests

- Located alongside components with `.cy.ts` extension
- Test component behavior in isolation

## Best Practices

### Writing Unit Tests

1. **Test one thing at a time**: Each test should focus on a single behavior
2. **Use descriptive test names**: Clearly describe what the test is verifying
3. **Arrange, Act, Assert**: Structure tests with clear setup, execution, and verification phases
4. **Mock dependencies**: Use Angular's TestBed and mocking utilities
5. **Test edge cases**: Include tests for error conditions and boundary values

### Writing E2E Tests

1. **Test user journeys**: Focus on complete workflows
2. **Use data-testid attributes**: For reliable element selection
3. **Avoid flaky tests**: Use proper waiting strategies
4. **Keep tests independent**: Each test should be runnable in isolation

### Code Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

## CI/CD Integration

Tests are integrated into the CI/CD pipeline and run automatically on:

- Pull requests
- Main branch pushes
- Release builds

### CI Configuration

- Located in `.github/workflows/` (if using GitHub Actions)
- Runs both unit and E2E tests
- Generates coverage reports
- Fails build on test failures or coverage below thresholds

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
ng test --include='**/auth.service.spec.ts'

# Debug in browser
ng test --browsers=Chrome
```

### E2E Tests

```bash
# Run specific test file
npx cypress run --spec 'cypress/e2e/app.cy.ts'

# Debug with Cypress UI
npm run cy:open
```

## Common Issues

### Flaky E2E Tests

- Use `cy.wait()` sparingly, prefer `cy.get().should()` for assertions
- Avoid fixed timeouts, use dynamic waiting
- Ensure test data is properly isolated

### Coverage Gaps

- Review coverage reports regularly
- Add tests for uncovered code paths
- Consider if uncovered code is actually unreachable

### Test Performance

- Keep unit tests fast (< 100ms each)
- Parallelize E2E tests when possible
- Use test skipping for slow or unstable tests during development

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage percentages
4. Update this documentation if testing patterns change

## Resources

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Cypress Documentation](https://docs.cypress.io/)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Istanbul Coverage](https://istanbul.js.org/)