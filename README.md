# Walmart-Take-Home-Challenge

This coding challenge searches for a keyword from a list of items queried against the Walmart API

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the necessary dependencies.

```
npm install
```

## Usage

Run the following command to run the application on the host and port specified in the config.json file

```
npm start
```

## Tests

Run the unit tests by running the following command.

```
npm test
```

## Application

The front end is an angular js application that render's the template of the current route into the main layout. It is essentially a single page application. The angular js client interacts with the node.js server to display a list of items based on the keyword queried by the user.

## Application Security

- A new token is generated before every search request.
- The amount of time the token is valid is defined in the config file.
- Every request made to the application is intercepted and checked for a valid token all unauthorized requestes are returned an HTTP status code 403.

## Considerations

- Limiting number of items queried by the walmart API to 20 items.
- Sublists are created and queried if the number of items in the csv file are greater than 20, because the Walmart API can handle querying only 20 items at a given time.
- The queried keyword is searched for in the short description of an item if the long description for that item does not exist.
- The following HTML entities are cleaned up from the descriptions of the items
  - \&quot;
  - \&mdash;
  - \&nbsp;

## Exceptions

- Generally the API key in the configuration file will not be commited, but for the sake of this challenge i have included the key in the config file.

## Code structure

```
.
├── client
│   ├── resources
│   │   ├── css                         # CSS resource files
│   │   ├── files                       # Files that are not .css | .js | .html are places here
│   │   ├── images                      # Image resource files
│   │   └── js
│   │       ├── controllers
│   │       │   └── search.js           # Search controller for the angular js front end
│   │       ├── lib                     # Javascript resource files
│   │       └── app.js                  # Angular js application entry point
│   │
│   ├── views
│   │   ├── partials                    # Folder containing the templates
│   │   │   ├── item.html               # Template to display the selected item from the result list
│   │   │   ├── results.html            # Template to display the search results
│   │   │   └── search_box.html         # Template to show the search box
│   │   └── search.html                 # Search page
│   └── client.html                     # Parent page for the application
│
├── server
│   ├── api.js                          # API Definitions
│   ├── routes.js                       # Application route definitions
│   └── utils.js                        # Utility library containing the custom helper functions
│
├── tests
│   └── index.js                        # Unit tests
│
├── index.js                            # Node js Server definition
├── config.json                         # Configuration file
├── package.json
├── package-lock.json
└── README.md
```

## Configuration file structure

```
{
  "host": "0.0.0.0",                                # Application host address
  "port": "3000",                                   # Port on which the application will run
  "secret": "walmart",                              # Secret key required to create a new token
  "tokenExpiry": 1000,                              # Token validity in seconds
  "securePaths": ["/api/token"],                    # Paths that do not need token verification
  "apiPaths": ["/api/"],                            # Prefixes for the API that need token verification
  "files": {
    "itemIds": "client/resources/files/items.csv"   # Path to the walmart catalogue list
  },
  "api": {
    "walmart": {
      "keys": "kjybrqfdgp3u4yv2qzcnjndj",           # API key for the walmart API
      "limit": 20                                   # Number of items that can be queried at a time
    }
  }
}

```
