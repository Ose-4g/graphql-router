import { GraphQLFieldConfig } from 'graphql';
import 'reflect-metadata';
import { Middleware, Route, Router } from './Router';

const CLASS_MIDDLEWARE_SYMBOL = Symbol('Group');

//define middleware to be run on all annotated reolvers in the class.
/**
 * It adds middleware functions to be run beforeall other defined middleware in the class.
 * @param resolvers an array or resolvers to be run before the main reolver
 * @returns
 */
export const classMiddleware = function (...middleware: Middleware[]): ClassDecorator {
  return function (constructor: Function) {
    let allMiddlewares: Middleware[] = Reflect.getMetadata(CLASS_MIDDLEWARE_SYMBOL, constructor) || [];
    allMiddlewares = allMiddlewares.concat(middleware);
    Reflect.defineMetadata(CLASS_MIDDLEWARE_SYMBOL, allMiddlewares, constructor);
  };
};

//define middlware to run after the groupmiddlware and before the resolver themselves.
/**
 * Adds middleware to be run after the global middleware and after the
 * @param resolvers
 * @returns
 */
export const middleware = function (...middlewares: Middleware[]): PropertyDecorator {
  return function (target: Object, propertyKey: string | Symbol) {
    let val: GraphQLFieldConfig<any, any, any>;

    //we're getting middleware from the class in the getter because property decorators get called before class decorators.
    const getter = function () {
      let allMiddlewares: Middleware[] = Reflect.getMetadata(CLASS_MIDDLEWARE_SYMBOL, target.constructor) || [];
      allMiddlewares = allMiddlewares.concat(middlewares);
      const router = new Router();

      const newVal = router.compress(new Route('', val, allMiddlewares));
      return newVal;
    };

    const setter = function (original: GraphQLFieldConfig<any, any, any>) {
      val = original;
    };

    Object.defineProperty(target, propertyKey as string, {
      get: getter,
      set: setter,
    });
  };
};
