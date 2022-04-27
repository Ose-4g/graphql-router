import { GraphQLFieldConfig, GraphQLResolveInfo } from 'graphql';

export type Next = (error?: Error) => any;

export type Middleware = (next: Next, parent: any, args: any, context?: any, info?: GraphQLResolveInfo) => any;

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
      let main: any = null;
      const next: Next = (error?: Error) => {
        if (error) {
          throw error;
        } else if (pos < n) {
          return allMiddlewares[pos++](next, parent, args, context, info);
        } else if (graphQLField.resolve) {
          main = graphQLField.resolve(parent, args, context, info);
          pos = 0;
          console.log('main = ', main);
          console.log('returning main');
          return main;
        }
      };

      return next();
      // console.log('returning main');
      // return main;
    };

    return {
      ...graphQLField,
      resolve: newResolver,
    };
  }
}
