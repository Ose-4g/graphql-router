import { Middleware, Next } from '../../Router';
import { GraphQLResolveInfo } from 'graphql';

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

/**
 * creates a simple middleware to be used for testing.
 * @param val string describing that middleware
 * @returns
 */
export const createMiddleware = function (val: string): Middleware {
  return async (parent: any, args: any, context: any, info: GraphQLResolveInfo, next: Next) => {
    if (!args.name) args.name = '';
    args.name += `-->${val}`;
    console.log(val, 'started');
    await resolveAfter2Seconds();
    console.log(val, 'done waiting');
    next();
    //console.log(val, 'ended');
  };
};
