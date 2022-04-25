# graphql-middleware

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
