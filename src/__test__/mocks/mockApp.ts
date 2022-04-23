import express, { Request, Response } from 'express';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { graphqlHTTP } from 'express-graphql';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {},
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {},
});

const schema: GraphQLSchema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

app.use('/graphql', (req: Request, res: Response) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
  })(req, res);
});

export { app };
