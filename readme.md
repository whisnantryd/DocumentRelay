#Document Relay server
##Think 'LiveDocument' extended
DocumentRelay is a server written in nodejs that provides a broadcast point for multiple transport protocols including raw tcp, web sockets and an http endpoint. The http endpoints are dynamic and added as different document types are pushed to the server via 'PUT' requests.

###Message structure
Documents pushed to the server must be in the format

        {
            "type": "{this will be the endpoint path}",
            "cache": {true/false},
            "date": "{time stamp, ISO 8061 recommended}",
            "msg": {
                ...
            }
        }

###Authentication
Authentication for the endpoints is handled by requiring a basic auth header on the put and get requests. Mongodb is used to store users including roles and specific endpoint permits.