# Bikram Sambat

A monorepo containing tools and utilities for working with the Bikram Sambat calendar system.

## 🏗️ Project Structure

This monorepo is organized into the following structure:

```
.
├── apps/          # Application projects
│   └── docs/      # Documentation site
├── packages/      # Shared packages
│   ├── bikram-sambat/  # Core Bikram Sambat utilities
│   ├── react/          # React components and hooks
│   └── eslint-config/  # Shared ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8.15.6

## 📦 Available Scripts

- `pnpm dev` - Start development servers for all packages
- `pnpm build` - Build all packages
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Run linting
- `pnpm format` - Format code using Prettier
- `pnpm storybook` - Start Storybook for component development
- `pnpm changeset` - Create a new changeset
- `pnpm version-packages` - Version packages based on changesets
- `pnpm release` - Build and publish packages

## 🤝 Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our development process and how to submit pull requests.

## 📜 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community guidelines and standards of behavior.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔧 Development Tools

- [Turborepo](https://turbo.build/) - High-performance build system
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [Changesets](https://github.com/changesets/changesets) - Version management and publishing
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Prettier](https://prettier.io/) - Code formatting
