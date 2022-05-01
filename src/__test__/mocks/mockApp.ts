import express, { Request, Response } from 'express';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { Router } from '../../Router';
import { ResolverCD as Resolver } from './resolvers';
import { createMiddleware } from './helpers';
import './resolvers';
import 'reflect-metadata';

const resolver = new Resolver();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = new Router();
router
  .use(createMiddleware('global-middlware'), createMiddleware('gloabl1'))
  .query('hello', resolver.hello, createMiddleware('globalpre2'))
  .use(createMiddleware('global2'))
  .query('random', resolver.random, createMiddleware('gloabl3'));

const newRouter = new Router();
newRouter.use(createMiddleware('I will run first first')).use(router);
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: newRouter.getQueryFields(),
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
