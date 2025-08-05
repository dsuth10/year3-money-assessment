# Contributing to Year 3 Money Assessment

Thank you for your interest in contributing to the Year 3 Money Assessment project! This document provides guidelines for contributing to the project.

## Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/year3-money-assessment.git
   cd year3-money-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run linting**
   ```bash
   npm run lint
   ```

## Code Style

- **TypeScript**: Use strict TypeScript configuration
- **React**: Use functional components with hooks
- **State Management**: Use Zustand for state management
- **Styling**: Use Tailwind CSS for styling
- **Database**: Use Dexie for IndexedDB operations

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add student progress tracking
fix: resolve quiz navigation issue
docs: update README with new features
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the code style guidelines
   - Add tests if applicable
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use the provided templates
   - Describe your changes clearly
   - Link any related issues

## Testing

- Run the development server and test manually
- Ensure all linting passes: `npm run lint`
- Build the project: `npm run build`
- Test offline functionality

## Reporting Issues

- Use the bug report template
- Provide clear steps to reproduce
- Include browser and OS information
- Add screenshots if applicable

## Feature Requests

- Use the feature request template
- Describe the problem and proposed solution
- Consider alternatives and trade-offs

## Questions?

If you have questions about contributing, please open an issue or contact the maintainers.

Thank you for contributing to educational technology! 