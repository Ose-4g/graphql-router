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
  .add('hello', resolver.hello, createMiddleware('globalpre2'))
  .use(createMiddleware('global2'))
  .add('random', resolver.random, createMiddleware('gloabl3'));

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: router.getFields(),
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
