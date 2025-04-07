# Contributing to Bikram Sambat

We love your input! We want to make contributing to Bikram Sambat as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the documentation with details of any new functionality.
3. The PR will be merged once you have the sign-off of at least one maintainer.
4. Create a changeset using `pnpm changeset` to document your changes.

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/nakarmi23/bikram-sambat/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/nakarmi23/bikram-sambat/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Use a Consistent Coding Style

* Use TypeScript for all new code
* 2 spaces for indentation rather than tabs
* You can try running `pnpm lint` for style unification

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md).

## Project Setup

1. Clone the repository:
```bash
git clone https://github.com/nakarmi23/bikram-sambat.git
cd bikram-sambat
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

4. Make your changes and commit them:
```bash
git add .
git commit -m "feat: your feature description"
```

5. Push your changes:
```bash
git push origin feature/your-feature-name
```

## Testing

- Run tests: `pnpm test`
- Run tests in watch mode: `pnpm test:watch`
- Run tests for a specific package: `pnpm test --filter=@nakarmi23/bikram-sambat`

## Documentation

- Keep documentation up to date with your changes
- Use TypeDoc comments for code documentation
- Update README.md if you're changing public APIs
- Add examples for new features

## Release Process

1. Create a changeset:
```bash
pnpm changeset
```

2. Select the packages that have changed
3. Choose the type of change (major, minor, patch)
4. Describe your changes
5. Commit the changeset
6. Create a pull request

## Questions?

Feel free to open an issue for any questions or concerns you might have about contributing.
