var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var OpenMicsData = require('./OpenMicsData.json');
const cors = require('cors')

// GraphQL schema
var schema = buildSchema(`
    type Query {
        OpenMic(id: ID!): OpenMic
        OpenMics: [OpenMic]
    },
    type Mutation {
        updateOpenMicLocation(id: ID!, location: String!): OpenMic
    }
    type OpenMic {
        id: ID!
        title: String
        location: String
        author: String
        description: String
        url: String
        phone: String
    }
`);

var getOpenMic = function(args) { 
    var id = args.id;
    return OpenMicsData.data.filter(OpenMic => {
        return OpenMic.id == id;
    })[0];
}
var getOpenMics = function(args) {
        return OpenMicsData.data;
}
var updateOpenMicLocation = function({id, location}) {
    OpenMicsData.data.map(OpenMic => {
        if (OpenMic.id === id) {
            OpenMic.location = location;
            return OpenMic;
        }
    });
    return OpenMicsData.data.filter(OpenMic => OpenMic.id === id) [0];
}
var root = {
    OpenMic: getOpenMic,
    OpenMics: getOpenMics,
    updateOpenMicLocation: updateOpenMicLocation
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use(cors())
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));