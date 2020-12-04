<h1 align="center">GraphQL isAuthenticated</h1>
<p align="center">
    <img alt="License" src="https://img.shields.io/github/license/Tomburgs/graphql-is-authenticated?label=License">
    <img alt="Version" src="https://img.shields.io/github/package-json/v/Tomburgs/graphql-is-authenticated?label=Version">
    <img alt="Size" src="https://img.shields.io/bundlephobia/minzip/graphql-is-authenticated?label=Size">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/graphql-is-authenticated?label=Downloads">
</p>

A handy-dandy GraphQL directive for setting authentication requirement on fields.

## Install

```bash
yarn add graphql-is-authenticated
```

## Usage

You want to include `@isAuthenticated` directive on fields you wish to be restricted.

```graphql
type Query {
    teapot: String! @isAuthenticated
}
```

This will return an `AuthenticationError` for users who are attempting to access this field, but are not authenticated.

You have two ways to specify if a user is authenticated:

### Option 1: Set isAuthenticated on context

You would define it as follows for Apollo Server or similar:

```js
import { 
    createIsAuthenticatedDirective,
    createIsAuthenticatedTypeDef
} from 'graphql-is-authenticated';

new ApolloServer({
    typeDefs: [createIsAuthenticatedTypeDef(), ...otherTypeDefs],
    schemaDirectives: {
        isAuthenticated: createIsAuthenticatedDirective()
    },
    context: (ctx) => {
        const isAuthenticated = checkIsUserAuthenticated();

        return { isAuthenticated };
    }
    ...
});
```

### Option 2: Pass checkIsUserAuthenticated method

You can also pass a function as an argument to `createIsAuthenticatedDirective` which takes an argument of context, and returns a promise which resolves a boolean.

```js
import { 
    createIsAuthenticatedDirective,
    createIsAuthenticatedTypeDef
} from 'graphql-is-authenticated';

const checkIsUserAuthenticated = async (ctx) => {
    const { req } = ctx;
    const { authorization } = ctx.headers;

    if (!authorization) {
        return false;
    }

    const isAuthenticated = await verifyAuthorizationHeader(authorization);

    return isAuthenticated;
};

new ApolloServer({
    typeDefs: [createIsAuthenticatedTypeDef(), ...otherTypeDefs],
    schemaDirectives: {
        isAuthenticated: createIsAuthenticatedDirective(checkIsUserAuthenticated)
    }
    ...
});
```

## Supporters

Many thanks to the people below for supporting this project! 🎉

[![Stargazers repo roster for @Tomburgs/graphql-is-authenticated](https://reporoster.com/stars/Tomburgs/graphql-is-authenticated)](https://github.com/Tomburgs/graphql-is-authenticated/stargazers)
[![Forkers repo roster for @Tomburgs/graphql-is-authenticated](https://reporoster.com/forks/Tomburgs/graphql-is-authenticated)](https://github.com/Tomburgs/graphql-is-authenticated/network/members)
