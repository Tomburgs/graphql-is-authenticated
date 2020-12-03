import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import {
    createIsAuthenticatedDirective,
    createIsAuthenticatedTypeDef
} from '../src';
import { UNAUTHENTICATED } from '../src/errors';
import gql from 'graphql-tag';

/*
 * In honor of the Cambridge coffee pot.
 */
const IM_A_TEAPOT = "I'm a teapot";
const resolvers = {
    Query: {
        teapot: () => IM_A_TEAPOT
    }
};

/*
 * We're testing with the same queries & values all over.
 * That's why we have them neatly defined here.
 */
const defaultQuery = 'query { teapot }';
const defaultResponse = { data: { teapot: IM_A_TEAPOT } };
const defaultSchema = {
    resolvers,
    schemaDirectives: {
        isAuthenticated: createIsAuthenticatedDirective()
    }
};


describe('isAuthenticated = false', () => {
    it('Succeeds without @isAuthenticated directive', async () => {
        const typeDefs = gql`
            type Query {
                teapot: String!
            }
        `;
        const schema = makeExecutableSchema({
            ...defaultSchema,
            typeDefs: [createIsAuthenticatedTypeDef(), typeDefs]
        });

        const response = await graphql(schema, defaultQuery);

        expect(response).toEqual(defaultResponse);
    });

    it('Fails with @isAuthenticated directive', async () => {
        const typeDefs = gql`
            type Query {
                teapot: String! @isAuthenticated
            }
        `;
        const schema = makeExecutableSchema({
            ...defaultSchema,
            typeDefs: [createIsAuthenticatedTypeDef(), typeDefs]
        });

        const { errors, errors: [firstError], data } = await graphql(schema, defaultQuery);

        expect(data).toEqual(null);
        expect(errors).toHaveLength(1);
        expect(firstError.extensions.code).toEqual(UNAUTHENTICATED);
    });
});

describe('isAuthenticated = true', () => {
    const graphqlOptions = [null, { isAuthenticated: true }];

    it('Succeeds without @isAuthenticated directive', async () => {
        const typeDefs = gql`
            type Query {
                teapot: String!
            }
        `;

        const schema = makeExecutableSchema({
            ...defaultSchema,
            typeDefs: [createIsAuthenticatedTypeDef(), typeDefs]
        });

        const response = await graphql(schema, defaultQuery, ...graphqlOptions);

        expect(response).toEqual({ data: { teapot: IM_A_TEAPOT } });
    });

    it('Succeeds with @isAuthenticated directive', async () => {
        const typeDefs = gql`
            type Query {
                teapot: String! @isAuthenticated
            }
        `;

        const schema = makeExecutableSchema({
            ...defaultSchema,
            typeDefs: [createIsAuthenticatedTypeDef(), typeDefs]
        });

        const response = await graphql(schema, defaultQuery, ...graphqlOptions);

        expect(response).toEqual(defaultResponse);
    });
});

describe('Custom isAuthenticated resolver', () => {
    const typeDefs = gql`
        type Query {
            teapot: String! @isAuthenticated
        }
    `;
    const defaultSchema = {
        typeDefs: [createIsAuthenticatedTypeDef(), typeDefs],
        resolvers,
    };

    it('Succeeds with @isAuthenticated directive when true is returned', async () => {
        const schema = makeExecutableSchema({
            ...defaultSchema,
            schemaDirectives: {
                isAuthenticated: createIsAuthenticatedDirective(
                    () => Promise.resolve(true)
                )
            }
        });

        const response = await graphql(schema, defaultQuery);

        expect(response).toEqual(defaultResponse);
    });

    it('Fails with @isAuthenticated directive when false is returned', async () => {
        const schema = makeExecutableSchema({
            ...defaultSchema,
            schemaDirectives: {
                isAuthenticated: createIsAuthenticatedDirective(
                    () => Promise.resolve(false)
                )
            }
        });

        const { errors, errors: [firstError], data } = await graphql(schema, defaultQuery);

        expect(data).toEqual(null);
        expect(errors).toHaveLength(1);
        expect(firstError.extensions.code).toEqual(UNAUTHENTICATED);
    });
});
