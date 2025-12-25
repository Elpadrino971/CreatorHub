# Contributing to CreatorHub

Thank you for your interest in contributing to CreatorHub! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a detailed bug report** with:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. **Check roadmap** and existing feature requests
2. **Create a feature request** with:
   - Clear use case and problem it solves
   - Proposed solution
   - Alternative approaches considered
   - Impact on existing features

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Write tests for new features
   - Update documentation
   - Keep commits atomic and well-described

4. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm test
   ```

5. **Submit PR to `develop` branch**
   - Fill out PR template
   - Link related issues
   - Request review from maintainers

## Development Setup

See [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) for detailed setup instructions.

Quick start:
```bash
git clone <repo-url>
cd CreatorHub
npm install
cp .env.example .env
# Fill in .env with your credentials
npx prisma db push
npm run dev
```

## Code Style

### TypeScript
- Use TypeScript strict mode
- Prefer explicit types over `any`
- Use meaningful variable names
- Comment complex logic

### React
- Functional components only
- Use TypeScript for props
- Extract complex logic to hooks
- Keep components focused and small

### Git Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add analytics chart component
fix: resolve YouTube token refresh issue
docs: update API integration guide
refactor: simplify database queries
test: add tests for calendar component
```

### File Organization
```
src/
├── app/                    # Pages and routes
├── components/
│   ├── ui/                # shadcn/ui components
│   └── [feature]/         # Feature-specific components
└── lib/
    ├── integrations/      # Platform integrations
    └── utils/             # Helper functions
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Documentation

Update relevant documentation for:
- New features
- API changes
- Configuration changes
- Breaking changes

Documentation lives in:
- `README.md` - Project overview
- `docs/` - Detailed guides
- Code comments - Complex logic
- JSDoc - Function documentation

## Review Process

1. **Automated checks** must pass:
   - Linting
   - Type checking
   - Tests
   - Build

2. **Code review** by maintainer:
   - Code quality
   - Architecture fit
   - Test coverage
   - Documentation

3. **Approval and merge**:
   - Squash merge to `develop`
   - Release from `develop` to `main`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Check [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)
- Ask in GitHub Discussions
- Contact maintainers

Thank you for contributing to CreatorHub! 🚀
