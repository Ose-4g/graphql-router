import { GraphQLFieldConfig, GraphQLResolveInfo } from 'graphql';

export type Middleware = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => any;

export class Router {
  private middlewares: Middleware[] = [];

  use(...middlewares: Middleware[]): Router {
    this.middlewares = this.middlewares.concat(middlewares);
    return this;
  }

  add(
    graphQLField: GraphQLFieldConfig<any, any, any>,
    ...middlewares: Middleware[]
  ): GraphQLFieldConfig<any, any, any> {
    const allMiddlewares = this.middlewares.concat(middlewares);

    let newResolver = async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
      for (const middleware of allMiddlewares) {
        await middleware(parent, args, context, info);
      }
      if (!graphQLField.resolve) throw new Error('resolve function not defined');
      return graphQLField.resolve ? graphQLField.resolve(parent, args, context, info) : null;
    };

    return {
      ...graphQLField,
      resolve: newResolver,
    };
  }
}
