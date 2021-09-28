    import ws from 'ws'; // yarn add ws
    import { useServer } from 'graphql-ws/lib/use/ws';
    import { buildSchema } from 'graphql';

    // Construct a schema, using GraphQL schema language
    const schema = buildSchema(`
    type Query {
        hello: String
    }
    type Mutation {
      hello: String
    }
    type Subscription {
        greetings: String
    }
    `);

    // The roots provide resolvers for each GraphQL operation
    const roots = {
      query: {
        hello: () => 'Hello World!',
      },
      mutation: {
        hello: () => 'Hello Mutation!',
      },
      subscription: {
        greetings: async function* sayHiIn5Languages() {
          for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
            yield { greetings: hi };
          }
        },
      },
    };

    let port = 9090;
    const server = new ws.Server({
    port: port,
    path: '/graphql',
    });

    useServer(
        {
          schema,
          roots,
          onConnect: (ctx) => {
            console.log('Connect', ctx);
          },
          onSubscribe: (ctx, msg) => {
            console.log('Subscribe', { ctx, msg });
          },
          onNext: (ctx, msg, args, result) => {
            console.debug('Next', { ctx, msg, args, result });
          },
          onError: (ctx, msg, errors) => {
            console.error('Error', { ctx, msg, errors });
          },
          onComplete: (ctx, msg) => {
            console.log('Complete', { ctx, msg });
          },
        },
        server,
      );
      

    console.log('Listening to port ' + port);