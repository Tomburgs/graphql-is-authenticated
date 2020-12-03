import { GraphQLError, SourceLocation, ASTNode, Source } from 'graphql';

export const UNAUTHENTICATED = 'UNAUTHENTICATED';

export class AuthenticationError extends Error implements GraphQLError {
    public extensions: Record<string, any>;
    readonly locations: ReadonlyArray<SourceLocation> | undefined;
    readonly path: ReadonlyArray<string | number> | undefined;
    readonly nodes: ReadonlyArray<ASTNode> | undefined;
    readonly source: Source | undefined;
    readonly positions: ReadonlyArray<number> | undefined;
    readonly originalError: Error | null | undefined;

    constructor(message: string) {
        super(message);

        this.name = 'AuthenticationError';
        this.extensions = {
            ...this.extensions,
            code: UNAUTHENTICATED
        };
    }
}
