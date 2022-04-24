import { GraphQLFieldConfig, GraphQLResolveInfo } from 'graphql';

export type Next = (error?: Error) => any;

export type Middleware = (parent: any, args: any, context: any, info: GraphQLResolveInfo, next: Next) => any;

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
    const n = allMiddlewares.length;
    let pos = 0;
    let newResolver = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
      let main: any;
      const next: Next = (error?: Error) => {
        if (error) throw error;
        else if (pos < n) allMiddlewares[pos++](parent, args, context, info, next);
        else if (graphQLField.resolve) {
          main = graphQLField.resolve(parent, args, context, info);
        }
      };
      next();
      pos = 0;
      return main;
    };

    return {
      ...graphQLField,
      resolve: newResolver,
    };
  }
}
