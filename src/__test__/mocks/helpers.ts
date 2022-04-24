import { Middleware, Next } from '../../Router';
import { GraphQLResolveInfo } from 'graphql';

/**
 * creates a simple middleware to be used for testing.
 * @param val string describing that middleware
 * @returns
 */
export const createMiddleware = function (val: string): Middleware {
  return (parent: any, args: any, context: any, info: GraphQLResolveInfo, next: Next) => {
    if (!args.name) args.name = '';
    args.name += `-->${val}`;
    console.log(val, 'started');
    next();
    console.log(val, 'ended');
  };
};
