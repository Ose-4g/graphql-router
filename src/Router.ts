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
    let newResolver = async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
      let main: any;
      const next: Next = async (error?: Error) => {
        if (error) throw error;
        else if (pos < n) await allMiddlewares[pos++](parent, args, context, info, next);
        else if (graphQLField.resolve) {
          main = await graphQLField.resolve(parent, args, context, info);
        }
      };
      await next();
      pos = 0;
      return main;
    };

    return {
      ...graphQLField,
      resolve: newResolver,
    };
  }
}
