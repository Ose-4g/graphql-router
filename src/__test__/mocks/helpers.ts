import { Middleware, Next } from '../../Router';
import { GraphQLResolveInfo } from 'graphql';

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, 500);
  });
}

/**
 * creates a simple middleware to be used for testing.
 * @param val string describing that middleware
 * @returns
 */
export const createMiddlewareAsync = function (val: string): Middleware {
  return async (next: Next, parent: any, args: any, context?: any, info?: GraphQLResolveInfo) => {
    if (!args.name) args.name = '';
    args.name += `-->${val}`;
    console.log(val, 'started');
    await resolveAfter2Seconds();
    console.log(val, 'done waiting');
    const result = await next();
    console.log(val, 'ended');
    return result;
  };
};

export const createMiddleware = function (val: string): Middleware {
  return (next: Next, parent: any, args: any, context?: any, info?: GraphQLResolveInfo) => {
    if (!args.name) args.name = '';
    args.name += `-->${val}`;
    console.log(val, 'started');
    const result = next();
    console.log(val, 'ended');
    return result;
  };
};
