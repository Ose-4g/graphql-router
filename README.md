# express-graphql-router

Write express-like routers in your graphql project.

## Installation

```bash
npm install express-graphql-router
```

or

```bash
yarn add express-graphql-router
```

### Quick links

- [Creating GraphQL APIs using this package](#creating-graphql-apis-using-this-package)
- [Using decorators](#using-decorators)

## Key advantages of this package.

- Easily use middleware thus ensuring seperation of concerns and avoiding code repetition.
- Group common resolvers together.

See an example below.

<br><br>

## Creating Graphql APIs using this package.

```typescript
// middleware.ts
import { Middleware } from 'express-graphql-router';

export const authenticationMiddleware: Middleware = (next, parent, args, context, info) => {
  console.log('in the authentication middleware');
  args.path = args.path || '';
  args.path += ' --> authentication-middleware';
  const result = next();
  console.log('after the authentication middleware');
  return result;
};

export const authorizationMiddleware: Middleware = (next, parent, args, context, info) => {
  console.log('in the authorization middleware');

  args.path = args.path || '';
  args.path += ' --> authorization-middleware';

  const result = next();
  console.log('after the authorization middleware');
  return result;
};

export const validateUser: Middleware = (next, parent, args, context, info) => {
  console.log('in the validate user middleware');

  args.path = args.path || '';
  args.path += ' --> validate-user-middleware';

  if (!args.name) return next(new Error('user name is required'));

  const result = next();
  console.log('after the validate-user middleware');
  return result;
};

export const validateBook: Middleware = (next, parent, args, context, info) => {
  console.log('in the validate book middleware');

  args.path = args.path || '';
  args.path += ' --> validate-book-middleware';

  if (!args.name) return next(new Error('book name is required'));

  const result = next();
  console.log('after the validate-book middleware');
  return result;
};
```

```typescript
// BookResolver.ts
import { GraphQLFieldConfig, GraphQLString } from 'graphql';
import { Router } from 'express-graphql-router';
import { authenticationMiddleware, authorizationMiddleware, validateBook } from './middlewares';

const getAllbooks: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {},
  async resolve(parent, args, context, info) {
    return 'getting all books' + args.path;
  },
};

const getSinglebook: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context, info) {
    return `getting book with id = ${args.id}` + args.path;
  },
};

const createbook: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {
    name: { type: GraphQLString },
  },
  async resolve(parent, args, context, info) {
    return `creating book with name = ${args.name}` + args.path;
  },
};

const updatebookdetails: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
  async resolve(parent, args, context, info) {
    return `update name to ${args.name} for book with id = ${args.id}` + args.path;
  },
};

const bookRouter = new Router();

bookRouter.use(authenticationMiddleware, authorizationMiddleware);

bookRouter.query('getAllbooks', getAllbooks);
bookRouter.query('getSinglebook', getSinglebook);
bookRouter.mutation('createbook', createbook, validateBook);
bookRouter.mutation('updatebook', updatebookdetails, validateBook);

export { bookRouter };
```

```typescript
// UserResolver.ts
import { GraphQLFieldConfig, GraphQLString } from 'graphql';
import { Router } from 'express-graphql-router';
import { authenticationMiddleware, authorizationMiddleware, validateUser } from './middlewares';

const getAllUsers: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {},
  async resolve(parent, args, context, info) {
    return 'getting all users' + args.path;
  },
};

const getSingleUser: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context, info) {
    return `getting user with id = ${args.id}` + args.path;
  },
};

const createUser: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {
    name: { type: GraphQLString },
  },
  async resolve(parent, args, context, info) {
    return `creating user with name = ${args.name}` + args.path;
  },
};

const updateUserdetails: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
  async resolve(parent, args, context, info) {
    return `update name to ${args.name} for user with id = ${args.id}` + args.path;
  },
};

const userRouter = new Router();

userRouter.use(authenticationMiddleware, authorizationMiddleware);

userRouter.query('getAllUsers', getAllUsers);
userRouter.query('getSingleUser', getSingleUser);
userRouter.mutation('createUser', createUser, validateUser);
userRouter.mutation('updateUser', updateUserdetails, validateUser);

export { userRouter };
```

```typescript
// app.ts
import express, { Request, Response } from 'express';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { Router } from 'express-graphql-router';

import { userRouter } from './UserResolver';
import { bookRouter } from './BookResolver';

const router = new Router();
router.use(userRouter);
router.use(bookRouter);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: router.getQueryFields(),
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: router.getMutationFields(),
});

const schema: GraphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

app.use('/graphql', (req: Request, res: Response) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
  })(req, res);
});

app.listen(3098, () => {
  console.log('graphql server running at http://localhost:3098/graphql');
});
export { app };
```

## Using Decorators

An extra feature supported only in typescript is Decorators. You can add middleware and define queries and mutations using the decorators.

See an example below.

```typescript
// middleware.ts
import { Middleware } from 'express-graphql-router';

export const authenticationMiddleware: Middleware = (next, parent, args, context, info) => {
  console.log('in the authentication middleware');
  args.path = args.path || '';
  args.path += ' --> authentication-middleware';
  const result = next();
  console.log('after the authentication middleware');
  return result;
};

export const authorizationMiddleware: Middleware = (next, parent, args, context, info) => {
  console.log('in the authorization middleware');

  args.path = args.path || '';
  args.path += ' --> authorization-middleware';

  const result = next();
  console.log('after the authorization middleware');
  return result;
};

export const validateUser: Middleware = (next, parent, args, context, info) => {
  console.log('in the validate user middleware');

  args.path = args.path || '';
  args.path += ' --> validate-user-middleware';

  if (!args.name) return next(new Error('user name is required'));

  const result = next();
  console.log('after the validate-user middleware');
  return result;
};

export const validateBook: Middleware = (next, parent, args, context, info) => {
  console.log('in the validate book middleware');

  args.path = args.path || '';
  args.path += ' --> validate-book-middleware';

  if (!args.name) return next(new Error('book name is required'));

  const result = next();
  console.log('after the validate-book middleware');
  return result;
};
```

```typescript
// UserResolver.ts
import { GraphQLFieldConfig, GraphQLString } from 'graphql';
import { mutation, query, Router } from 'express-graphql-router';
import { authenticationMiddleware, authorizationMiddleware, validateUser } from './middlewares';

class UserResolver {
  @query('getAllUsers', authenticationMiddleware, authorizationMiddleware)
  getAllUsers: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    args: {},
    async resolve(parent, args, context, info) {
      return 'getting all users' + args.path;
    },
  };

  @query('getSingleUser', authenticationMiddleware, authorizationMiddleware)
  getSingleUser: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    args: {
      id: { type: GraphQLString },
    },
    async resolve(parent, args, context, info) {
      return `getting user with id = ${args.id}` + args.path;
    },
  };

  @mutation('createUser', authenticationMiddleware, authorizationMiddleware, validateUser)
  createUser: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    args: {
      name: { type: GraphQLString },
    },
    async resolve(parent, args, context, info) {
      return `creating user with name = ${args.name}` + args.path;
    },
  };

  @mutation('updateUser', authenticationMiddleware, authorizationMiddleware, validateUser)
  updateUserdetails: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
    },
    async resolve(parent, args, context, info) {
      return `update name to ${args.name} for user with id = ${args.id}` + args.path;
    },
  };
}

new UserResolver();
const userRouter = Router.getRouter(UserResolver);

export { userRouter };
```

```typescript
// BookResolver.ts
import { GraphQLFieldConfig, GraphQLString } from 'graphql';
import { classMiddleware, mutation, query, Router } from 'express-graphql-router';
import { authenticationMiddleware, authorizationMiddleware, validateBook } from './middlewares';

@classMiddleware(authenticationMiddleware, authorizationMiddleware)
class BoolResolver {
  @query('getAllBooks')
  getAllbooks: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    args: {},
    async resolve(parent, args, context, info) {
      return 'getting all books' + args.path;
    },
  };

  @query('getSingleBook')
  getSinglebook: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    args: {
      id: { type: GraphQLString },
    },
    async resolve(parent, args, context, info) {
      return `getting book with id = ${args.id}` + args.path;
    },
  };

  @mutation('createBook', validateBook)
  createbook: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    args: {
      name: { type: GraphQLString },
    },
    async resolve(parent, args, context, info) {
      return `creating book with name = ${args.name}` + args.path;
    },
  };

  @mutation('updateBook', validateBook)
  updatebookdetails: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
    },
    async resolve(parent, args, context, info) {
      return `update name to ${args.name} for book with id = ${args.id}` + args.path;
    },
  };
}

new BoolResolver();
const bookRouter = Router.getRouter(BoolResolver);

export { bookRouter };
```

```typescript
// app.ts
import express, { Request, Response } from 'express';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { Router } from 'express-graphql-router';

import { userRouter } from './UserResolver';
import { bookRouter } from './BookResolver';

const router = new Router();
router.use(userRouter);
router.use(bookRouter);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: router.getQueryFields(),
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: router.getMutationFields(),
});

const schema: GraphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

app.use('/graphql', (req: Request, res: Response) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
  })(req, res);
});

app.listen(3098, () => {
  console.log('graphql server running at http://localhost:3098/graphql');
});
export { app };
```

As seen above, there are 3 decorators that are used

- **@query( name**: _string_, **...middleware**: _Middleware[]_ **)**: creates a new query resolver with specified middleware

- **@mutation( name**: _string_, **...middleware**: _Middleware[]_ **)**: creates a new mutation resolver with specified middleware

- **@classMiddleware(...middleware**: _Middleware[]_ **)**: adds specified middleware before all middleware in each of the resolvers in the class.

### NOTE

- When working with decorators, It is very important to create an instance of the resolver class to register the queries and mutation.
