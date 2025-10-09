# Contributing to RailTrack QR

First off, thank you for considering contributing to RailTrack QR! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes**
4. **Test your changes** thoroughly
5. **Follow the code style** of the project
6. **Write clear commit messages**
7. **Update documentation** if needed
8. **Submit a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/railtrack-qr.git

# Install dependencies
npm install

# Create .env.local with your Supabase credentials
cp .env.example .env.local

# Run development server
npm run dev
```

## Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await instead of promises

## Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

Examples:
```
Add user authentication feature

Implement JWT-based authentication with refresh tokens.
Closes #123
```

## Project Structure

- `app/` - Next.js app directory (pages and API routes)
- `components/` - React components
- `lib/` - Utility functions and helpers
- `types/` - TypeScript type definitions
- `supabase/migrations/` - Database migrations

## Testing

Before submitting a PR:

1. Test your changes locally
2. Ensure no TypeScript errors: `npm run build`
3. Test in different browsers if UI changes
4. Test with different user roles if auth-related

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
