import { GraphQLFieldConfig, GraphQLResolveInfo, ThunkObjMap } from 'graphql';
import { ROUTER_SYMBOL } from './decorators';

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
  private queryRoutes: Map<string, Route> = new Map();
  private mutationRoutes: Map<string, Route> = new Map();

  /**
   *
   * @param constructor : the class for which we want to get a router. This class must have at least one property tagged with query or mutation
   * @returns : The router for that class.
   */
  static getRouter(constructor: Function): Router {
    const router = Reflect.getMetadata(ROUTER_SYMBOL, constructor);
    if (!router) throw new Error(`no instance of ${constructor.name} has been created`);
    return router;
  }

  use(router: Router): Router;
  use(...middlewares: Middleware[]): Router;

  use(...val: unknown[]) {
    if (!val || val.length === 0) throw new Error('argument is required for router.use');
    if (val[0] instanceof Router) {
      const queryFields = val[0].getQueryFields();
      const mutationFields = val[0].getMutationFields();

      for (const key in queryFields) {
        this.query(key, (queryFields as any)[key]);
      }

      for (const key in mutationFields) {
        this.mutation(key, (mutationFields as any)[key]);
      }
    } else if (typeof val[0] === 'function') {
      this.middlewares = this.middlewares.concat(val as Middleware[]);
    }
    return this;
  }

  /**
   *
   * @param path name of the query
   * @param resolver : the resolver object
   * @param middleware : all middleware to run before the main resolver
   * @returns : Router object
   */
  query(path: string, resolver: GraphQLFieldConfig<any, any, any>, ...middleware: Middleware[]) {
    this.queryRoutes.set(path, new Route(path, resolver, [...this.middlewares, ...middleware]));
    return this;
  }

  /**
   *
   * @param path :name of the muatation
   * @param resolver : resolver object
   * @param middleware : all middlewares to be run before the main resolver
   * @returns : a router object
   */
  mutation(path: string, resolver: GraphQLFieldConfig<any, any, any>, ...middleware: Middleware[]) {
    this.mutationRoutes.set(path, new Route(path, resolver, [...this.middlewares, ...middleware]));
    return this;
  }

  /**
   *
   * @param route : a route object
   * @returns : a new resolver with all middlewares merged into one.
   */
  private compress(route: Route): GraphQLFieldConfig<any, any, any> {
    const allMiddlewares = route.middleware;
    const n = allMiddlewares.length;
    let pos = 0;
    const graphQLField = route.resolver;

    let newResolver = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
      let main: any = null;
      const next: Next = (error?: Error) => {
        if (error) {
          pos = 0;
          throw error;
        } else if (pos < n) {
          return allMiddlewares[pos++](next, parent, args, context, info);
        } else if (graphQLField.resolve) {
          main = graphQLField.resolve(parent, args, context, info);
          // console.log('main = ', main);
          // console.log('returning main');
          pos = 0;
          return main;
        }
      };

      try {
        return next();
      } catch (error) {
        pos = 0;
        throw error;
      }
    };

    return {
      ...graphQLField,
      resolve: newResolver,
    };
  }

  /**
   *
   * @returns returns a field of all mutations on the router
   */
  getMutationFields(): ThunkObjMap<GraphQLFieldConfig<any, any, any>> {
    let field: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {};
    this.mutationRoutes.forEach((route) => {
      (field as any)[route.path] = this.compress(route);
    });
    return field;
  }

  /**
   *
   * @returns returns an field of all queries on the router.
   */
  getQueryFields(): ThunkObjMap<GraphQLFieldConfig<any, any, any>> {
    let field: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {};
    this.queryRoutes.forEach((route) => {
      (field as any)[route.path] = this.compress(route);
    });
    return field;
  }
}
