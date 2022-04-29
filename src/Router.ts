import { GraphQLFieldConfig, GraphQLResolveInfo, ThunkObjMap } from 'graphql';

export type Next = (error?: Error) => any;

export type Middleware = (next: Next, parent: any, args: any, context?: any, info?: GraphQLResolveInfo) => any;

export class Route {
  constructor(
    public path: string,
    public resolver: GraphQLFieldConfig<any, any, any>,
    public middleware: Middleware[]
  ) {}
}
export class Router {
  private middlewares: Middleware[] = [];
  private routes: Route[] = [];

  use(...middlewares: Middleware[]): Router {
    this.middlewares = this.middlewares.concat(middlewares);
    return this;
  }

  add(path: string, resolver: GraphQLFieldConfig<any, any, any>, ...middleware: Middleware[]) {
    this.routes.push(new Route(path, resolver, [...this.middlewares, ...middleware]));
    return this;
  }

  compress(route: Route): GraphQLFieldConfig<any, any, any> {
    const allMiddlewares = route.middleware;
    const n = allMiddlewares.length;
    let pos = 0;
    const graphQLField = route.resolver;

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
          // console.log('main = ', main);
          // console.log('returning main');
          return main;
        }
      };

      return next();
    };

    return {
      ...graphQLField,
      resolve: newResolver,
    };
  }

  getFields(): ThunkObjMap<GraphQLFieldConfig<any, any, any>> {
    let field: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {};
    this.routes.forEach((route) => {
      (field as any)[route.path] = this.compress(route);
    });
    return field;
  }
}
