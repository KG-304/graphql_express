var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
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
var OpenMicsData = [
    {
        id: 1,
        location: '27-16 23rd Avenue Astoria, NY 11105',
        title: 'Open mic @ Q.E.D',
        author: 'Hosted by: Chris Farley',
        description: 'Be sure to come out and support your local comedians trying to make it big!',
        url: 'https://qedastoria.com/',
        phone: '347-451-3873'
    },
    {
        id: 2,
        location: '10-93 JACKSON AVENUE',
        title: 'Open mic @ Creek and Cabin',
        author: 'Hosted By: Adam Sandler',
        description: 'Come play games and support your local comedians in LIC!',
        url: 'https://creeklic.com/',
        phone: '718-706-8783'
    },
    {
        id: '3',
        location: '307 W 26th Street New York, NY 10001 ',
        title: 'Open mic @ Improv Asylum',
        author: 'Hosted By: Tom Segura',
        description: 'Come hang out with us tonight at our very own open mic!',
        url: 'https://www.improvasylum.com/',
        phone: '212-203-5435'
    }
]

var getOpenMic = function(args) { 
    var id = args.id;
    return OpenMicsData.filter(OpenMic => {
        return OpenMic.id == id;
    })[0];
}
var getOpenMics = function(args) {
        return OpenMicsData;
}
var updateOpenMicLocation = function({id, location}) {
    OpenMicsData.map(OpenMic => {
        if (OpenMic.id === id) {
            OpenMic.location = location;
            return OpenMic;
        }
    });
    return OpenMicsData.filter(OpenMic => OpenMic.id === id) [0];
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