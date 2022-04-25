# graphql-middleware

## Prelude

It is very easy working with middlewares for REST APIs in express. Look at the example below.

```typescript
import { Router, RequestHandler } from 'express';

const router = Router();
const validatePasswordMiddleware: RequestHandler = (req, res, next) => {
  if (!req.body.password) return next(new Error('password not provided'));
  return next();
};

router.post('/set-password', validatePasswordMiddleware, (req, res) => {
  const { password } = req.body;
  return res.status(200).json({ message: 'received password successfuly' });
});
```

This package tries to provides a similar functionality for GraphQL APIs

```typescript
import { Router, Middleware } from '@ose4g/graphql-middleware';

const router = Router();

const validatePasswordMiddleware: Middleware = (parent, args, context, info) => {
  if (!args.password) throw new Error('password not provided'));
};

const validateEmailMiddleware: Middleware = (parent, args, context, info) => {
  if (!args.email) throw new Error('email not provided'));
};

const resolver: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {
    password:{type: GraphQLString}
    email:{type: GraphQLString}
  },
  resolve(parent, args, context, info) {
    return 'login resolver called'
  },
};

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    login: router.add(resolver, validatePasswordMiddleware, validateEmailMiddleware)
  },
});

const schema: GraphQLSchema = new GraphQLSchema({ query: RootQuery });

```

```
When the login resolver is called .
the middleware first get executed in the order
validatePasswordMiddleware --> validateEmailMiddleware --> resolver
```

## Installation

```bash
npm install @ose4g/graphql-middleware
```

OR using yarn

```bash
yarn add @ose4g/graphql-middleware
```

## Usage

The **router** object has 2 methods.

- **use( ...middleware**: _Middleware[]_ **)**: adds middleware to the router object.
- **add( resolver**: _GraphQLFieldConfig<any,any,any>_, **...middleware**: _Middleware[]_ **)**: return a new resolver that calls all middleware and returns the original resolver.

## Extras

An extra feature that was added for use with typescript is decorators.
Look at how they are used below
