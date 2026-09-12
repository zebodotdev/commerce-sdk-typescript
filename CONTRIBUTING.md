# Contributing to the Inttegro TypeScript SDK

Thank you for your interest in contributing to the Inttegro TypeScript SDK! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 24.x or higher
- npm, yarn, or pnpm

### Setup Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/inttegro/inttegro-sdk-typescript.git
   cd inttegro-sdk-typescript
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building

Build the SDK:

```bash
npm run build
```

Watch mode for development:

```bash
npm run dev
```

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Linting and Formatting

Run linter:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

Check formatting:

```bash
npm run format:check
```

Format code:

```bash
npm run format
```

### Type Checking

Run TypeScript type checker:

```bash
npm run typecheck
```

## Making Changes

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Add JSDoc comments for public APIs
- Use meaningful variable and function names
- Keep functions small and focused

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(orders): add support for bulk order creation

fix(http-client): handle network timeout correctly

docs(readme): update installation instructions
```

### Pull Request Process

1. Update documentation for any changed functionality
2. Add or update tests for your changes
3. Ensure all tests pass: `npm test`
4. Ensure code is properly formatted: `npm run format`
5. Ensure no linting errors: `npm run lint`
6. Update CHANGELOG.md with your changes
7. Push your changes and create a pull request

### Pull Request Guidelines

- Provide a clear description of the changes
- Link to any related issues
- Include screenshots for UI changes (if applicable)
- Ensure CI checks pass
- Request review from maintainers
- Be responsive to feedback

## Adding New Features

When adding new features:

1. **Design First**: Discuss the feature in an issue before implementing
2. **Type Safety**: Add comprehensive TypeScript types
3. **Documentation**: Update README.md and add JSDoc comments
4. **Tests**: Write tests covering the new functionality
5. **Examples**: Add examples in the `examples/` directory
6. **Backwards Compatibility**: Maintain backwards compatibility when possible

## Testing Guidelines

### Unit Tests

- Test individual functions and classes
- Mock external dependencies
- Test both success and error cases
- Aim for >80% code coverage

### Integration Tests

- Test complete workflows
- Use realistic test data
- Test error scenarios

### Test Structure

```typescript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should do something when condition', () => {
      // Arrange
      const input = {
        /* test data */
      };

      // Act
      const result = methodName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should throw error when invalid input', () => {
      expect(() => methodName(invalid)).toThrow();
    });
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments to all public APIs
- Include parameter descriptions
- Include return value descriptions
- Add usage examples
- Document thrown errors

Example:

````typescript
/**
 * Create a new order
 *
 * @param request - Order creation request
 * @returns Created order details
 * @throws {InttegroValidationError} If request parameters are invalid
 *
 * @example
 * ```typescript
 * const order = await inttegro.orders.create({
 *   customerData: { ... },
 *   lineItems: [ ... ],
 * });
 * ```
 */
async create(request: CreateOrderRequest): Promise<Order>
````

### README Updates

Update README.md when:

- Adding new features
- Changing APIs
- Adding new configuration options
- Updating examples

## Reporting Issues

### Bug Reports

Include:

- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- SDK version
- Node.js version
- Operating system
- Code sample (if applicable)

### Feature Requests

Include:

- Clear description of the feature
- Use cases
- Examples of how it would be used
- Potential implementation approach (optional)

## Release Process

Releases are managed by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions will automatically publish to NPM

## Questions?

If you have questions about contributing:

- Open a discussion on GitHub
- Reach out to maintainers
- Check existing issues and pull requests

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Thank you for contributing to the Inttegro TypeScript SDK! Your contributions help make this project better for everyone.
