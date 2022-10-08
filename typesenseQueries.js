const {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} = require("@apollo/client");
const Typesense = require("typesense");
const fetch = require("cross-fetch");
const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://y7yu20xn.api.sanity.io/v1/graphql/master/default",
    fetch,
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
});

const getAllResorts = () => {
  console.log("CALLED");
  return client
    .query({
      query: gql`
        query getAllResorts {
          allResort {
            name
            location: locationFull
            # description: descriptionRaw
            tags: resortTransferType {
              transferType
            }
            numberOfRooms
          }
        }
      `,
    })
    .then((result) => {
      const allResorts = result?.data?.allResort.map(
        ({ name, location, tags, numberOfRooms }) => {
          const tags_ = tags.map(({ transferType }) => transferType);
          return {
            name,
            location,
            tags: tags_,
            numberOfRooms,
          };
        }
      );
      return allResorts;
    });
};

const generateTypesenseIndex = async () => {
  const allResorts = await getAllResorts();

  const typesenseClient = new Typesense.Client({
    nodes: [
      {
        host: "localhost",
        port: "8108",
        protocol: "http",
      },
    ],
    apiKey: "xyz", //fill-in with your own info
    connectionTimeoutSeconds: 60,
  });
  console.log("allResorts", allResorts);
  try {
    if (allResorts) {
      await typesenseClient
        .collections("resorts")
        .documents()
        .import(allResorts);
    }
  } catch (e) {
    console.log(e.importResults);
  }
};
exports.default = generateTypesenseIndex();
