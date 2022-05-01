import 'reflect-metadata';
import { Middleware, Router } from './Router';

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

export const query = function (path: string, ...middleware: Middleware[]): PropertyDecorator {
  return function (target: Object, propertyKey: string | Symbol) {
    const router: Router = Reflect.getMetadata(ROUTER_SYMBOL, target.constructor) || new Router();
    const resolver = (target as any)[propertyKey as string];
    console.log(resolver);
    router.query(path, resolver, ...middleware);
    Reflect.defineMetadata(ROUTER_SYMBOL, router, target.constructor);
  };
};

export const mutation = function (path: string, ...middleware: Middleware[]): PropertyDecorator {
  return function (target: Object, propertyKey: string | Symbol) {
    const router: Router = Reflect.getMetadata(ROUTER_SYMBOL, target.constructor) || new Router();
    router.mutation(path, (target as any)[propertyKey as string], ...middleware);
    Reflect.defineMetadata(ROUTER_SYMBOL, router, target.constructor);
  };
};
