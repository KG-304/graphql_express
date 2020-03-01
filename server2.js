var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var OpenMicsData = require('./OpenMicsData.json');
var User = require('./user.json')
const cors = require('cors')

// GraphQL schema
var schema = buildSchema(`
    type Query {
        OpenMic(id: ID!): OpenMic
        OpenMics(first: Int): [OpenMic]
        getUser(id: ID!): User
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
    type User{
        id: ID!
        email: String
        firstName: String
        lastName: String
    }
`);

var getUser = function(args){
    var id = args.id;
    return User.data.filter(user => {
        return user.id == id;
    })[0];
}

var getOpenMic = function(args) { 
    var id = args.id;
    return OpenMicsData.data.filter(OpenMic => {
        return OpenMic.id == id;
    })[0];
}

var getOpenMics = function(args) {
        return OpenMicsData.data.slice(0, args.first)
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
    User: getUser,
    OpenMic: getOpenMic,
    OpenMics: getOpenMics,
    updateOpenMicLocation: updateOpenMicLocation
};

var app = express();
app.use(cors())
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));