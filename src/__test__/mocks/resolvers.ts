import { classMiddleware, middleware } from '../../decorators';
import { GraphQLFieldConfig, GraphQLString } from 'graphql';
import { createMiddleware } from './helpers';

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, 500);
  });
}

const hello: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {},
  async resolve(parent, args, context, info) {
    await resolveAfter2Seconds();
    return 'My name is Ose4g' + args.name;
  },
};

const random: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {},
  async resolve(parent, args, context, info) {
    return 'My name is random' + args.name;
  },
};

export class Resolver {
  hello = hello;
  random = random;
}

export class ResolverD {
  @middleware(createMiddleware('helloMiddlware1'), createMiddleware('helloMiddlware2'))
  hello = hello;

  @middleware(createMiddleware('randomMiddleware1'), createMiddleware('randomMiddleware2'))
  random = random;
}

@classMiddleware(createMiddleware('class-middleware'))
export class ResolverCD {
  @middleware(createMiddleware('helloMiddlware1'), createMiddleware('helloMiddlware2'))
  hello = hello;

  @middleware(createMiddleware('randomMiddleware1'), createMiddleware('randomMiddleware2'))
  random = random;
}
