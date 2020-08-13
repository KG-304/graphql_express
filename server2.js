var express = require("express");
var express_graphql = require("express-graphql");
var { buildSchema } = require("graphql");
var invoices = require("./test_data/invoices.json");
var vendors = require("./test_data/vendorData.json")
var configs = require("./test_data/config.json")
const cors = require("cors");

// GraphQL schema
var schema = buildSchema(`
    type Query {
        Invoices(first: Int): [Invoice]
        Vendors(first: Int): [Vendor]
        Configs(id: ID!): Config
    },

    type Invoice{
        id: ID!
        vendorId: String
        quantity: Int
        product: String
        amountBal: Float
        amountDue: Float
        invoiceDate: String
    },

    type Vendor{
        vendorId: ID!
        vendorName: String
        creditBal: Float
    }

    type Config{
        id: ID!
        fieldName: String
        displayName: String
        display: Boolean
        filteringEnabled: Boolean
        sortingEnabled: Boolean
    }
`);

var Vendors = function (args) {
    return vendors.data.slice(0, args.first);
}

var Invoices = function (args) {
 return invoices.data.slice(0, args.first);
};

var Configs = function (args){
        return configs.data.filter((config) => {
            return config.id == args.id;
        })[0];
}

// test for update

// var updateOpenMicLocation = function ({ id, location }) {
//   OpenMicsData.data.map((OpenMic) => {
//     if (OpenMic.id === id) {
//       OpenMic.location = location;
//       return OpenMic;
//     }
//   });
//   return OpenMicsData.data.filter((OpenMic) => OpenMic.id === id)[0];
// };

var root = {
  Invoices: Invoices,
  Vendors: Vendors,
  Configs: Configs
};

var app = express();
app.use(cors());
app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000, () =>
  console.log("iVoyant Test Server Now Running On localhost:4000/graphql")
);
