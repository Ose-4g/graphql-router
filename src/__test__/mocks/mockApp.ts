import express, { Request, Response } from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLResolveInfo, GraphQLFieldConfig } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { Middleware, Next, Router } from '../../Router';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const createMiddleware = function (val: string): Middleware {
  return (parent: any, args: any, context: any, info: GraphQLResolveInfo, next: Next) => {
    if (!args.name) args.name = '';
    args.name += `-->${val}`;
    console.log(val, 'started');
    return next();
  };
};

const router = new Router();
router.use(createMiddleware('global-middlware'));

const helloResolver: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {},
  resolve(parent, args, context, info) {
    return 'My name is Ose4g' + args.name;
  },
};

const randomResolver: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  args: {},
  resolve(parent, args, context, info) {
    return 'My name is random' + args.name;
  },
};

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: router.add(helloResolver, createMiddleware('joiMiddleware'), createMiddleware('authiddleware')),
    random: router.add(randomResolver, createMiddleware('formatMiddleware')),
  },
});

// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {},
// });

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
