import 'reflect-metadata';
import { Middleware, Router } from './Router';
import { GraphQLFieldConfig } from 'graphql';
export const ROUTER_SYMBOL = Symbol('Router');

//define middleware to be run on all annotated reolvers in the class.
/**
 * It adds middleware functions to be run beforeall other defined middleware in the class.
 * @param resolvers an array or resolvers to be run before the main reolver
 * @returns
 */
export const classMiddleware = function (...middleware: Middleware[]): ClassDecorator {
  return function (constructor: Function) {
    const router: Router = Reflect.getMetadata(ROUTER_SYMBOL, constructor) || new Router();
    const newRouter: Router = new Router();
    newRouter.use(...middleware);
    newRouter.use(router);
    Reflect.defineMetadata(ROUTER_SYMBOL, newRouter, constructor);
  };
};

/**
 * Add a new query function
 * @param path : name of the query
 * @param middleware : all the middleware functions
 * @returns
 */
export const query = function (path: string, ...middleware: Middleware[]): PropertyDecorator {
  return function (target: Object, propertyKey: string | Symbol) {
    let val: GraphQLFieldConfig<any, any, any>;

    const getter = function () {
      return val;
    };

    const setter = function (original: GraphQLFieldConfig<any, any, any>) {
      val = original;
      const router: Router = Reflect.getMetadata(ROUTER_SYMBOL, target.constructor) || new Router();
      const resolver = original;
      router.query(path, resolver, ...middleware);
      Reflect.defineMetadata(ROUTER_SYMBOL, router, target.constructor);
    };

    Object.defineProperty(target, propertyKey as string, {
      get: getter,
      set: setter,
    });
  };
};

/**
 * Add a new mutation function
 * @param path : name of the mutation
 * @param middleware : all the middleware functions
 * @returns
 */
export const mutation = function (path: string, ...middleware: Middleware[]): PropertyDecorator {
  return function (target: Object, propertyKey: string | Symbol) {
    let val: GraphQLFieldConfig<any, any, any>;

    const getter = function () {
      return val;
    };

    const setter = function (original: GraphQLFieldConfig<any, any, any>) {
      val = original;
      const router: Router = Reflect.getMetadata(ROUTER_SYMBOL, target.constructor) || new Router();
      const resolver = original;
      router.mutation(path, resolver, ...middleware);
      Reflect.defineMetadata(ROUTER_SYMBOL, router, target.constructor);
    };

    Object.defineProperty(target, propertyKey as string, {
      get: getter,
      set: setter,
    });
  };
};
