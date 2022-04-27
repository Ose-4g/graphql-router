import express, { Request, Response } from 'express';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { Router } from '../../Router';
import { Resolver as Resolver } from './resolvers';
import { createMiddlewareAsync, createMiddleware } from './helpers';
import './resolvers';
import 'reflect-metadata';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = new Router();
router.use(createMiddleware('global-middlware'), createMiddlewareAsync('gloabl1'));

const resolver = new Resolver();

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: router.add(resolver.hello, createMiddlewareAsync('golabl2'), createMiddleware('global3')),
    random: resolver.random,
  },
});

const schema: GraphQLSchema = new GraphQLSchema({ query: RootQuery });

app.use('/graphql', (req: Request, res: Response) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
  })(req, res);
});

app.listen(3098, () => {
  console.log('graphql server started');
});
export { app };
