import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver, DocumentNode, GraphQLField } from 'graphql';
import { AuthenticationError } from 'errors';
import gql from 'graphql-tag';

type CheckIsAuthenticated<Context = any> = undefined | ((ctx: Context) => Promise<boolean> | boolean);

export const createIsAuthenticatedDirective = <Context = any>(checkIsAuthenticated?: CheckIsAuthenticated<Context>): typeof SchemaDirectiveVisitor => {
    return class extends SchemaDirectiveVisitor {
        visitFieldDefinition(field: GraphQLField<any, Context>) {
            const { resolve = defaultFieldResolver } = field;

            field.resolve = async (...args) => {
                const context = args[2];
                const isAuthenticated = await this._resolveIsAuthenticated(context);

                if (!isAuthenticated) {
                    throw new AuthenticationError('You need to be authenticated to access this field');
                }

                return resolve.apply(this, args);
            }
        }

        _resolveIsAuthenticated(context: any) {
            if (checkIsAuthenticated) {
                return checkIsAuthenticated(context);
            }

            return context?.isAuthenticated;
        }
    }
}

export const createIsAuthenticatedTypeDef = (name = 'isAuthenticated'): DocumentNode => (
    gql`
    """
    Checks if user is authenticated.
    """
    directive @${name} on FIELD_DEFINITION
    `
);
