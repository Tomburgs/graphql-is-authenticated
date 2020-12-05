# Contributing to GraphQL isAuthenticated

This project is intended to be a safe & welcoming space for collaboration.
Contributors are expected to adhere to [the code of conduct](CODE_OF_CONDUCT.md).

## Development

### Fork & Clone

Fork & clone the repo running the following command:
```bash
git clone git@github.com:<Your-Username>/graphql-is-authenticated.git
```

or clone using HTTP
```bash
git clone https://github.com:<Your-Username>/graphql-is-authenticated
```

### Install dependencies

Install the modules by running
```bash
yarn install
```

This will also run the tests and linters.

### Create a new branch

Now you can create a new branch from master:
```bash
git checkout -b my-feature origin/master
```

### Development commands

You can use the following development command:
```bash
yarn dev
```

This will automatically run `jest` in watch mode and will automatically compile your TypeScript code.

### Creating new PR

Before you create a new Pull Request ensure that your code is properly tested and there are no linter or testing errors.

You can run lint & jest by running the following command:
```bash
yarn prerelease
```

Et voilà, that's all you need to set up & develop on your local environment.

When creating a new Pull Request, please ensure that you follow the PR template.
