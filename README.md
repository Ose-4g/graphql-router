# graphql-middleware

It is very easy working with middlewares for REST APIs in express. Look at the example below.

```typescript
import { Router, Response, Request, NextFunction, RequestHandler } from 'express';

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

This package provides a similar functionality for GraphQL APIs

```typescript
import { Router, Response, Request, NextFunction, RequestHandler } from 'express';

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
