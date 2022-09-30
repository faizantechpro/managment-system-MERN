# openapi

[express-openapi](api/lib/middlewares/openapi/types.ts) is a package which generates OpenAPI compliant documentation for express. However, it requires route implementations to be structured in a specific method:

```
api/
  organizations.ts
  organizations/
    {id}.ts
  users.ts
  users/
    {id}.ts
    {id}/
      invites.ts
```

Given the above folder structure, express-openapi would create the following endpoints (assuming they're all GET):

* GET /organizations
* GET /organizations/{id}
* GET /users
* GET /users/{id}
* GET /users/{id}/invites

Your folder structure essentially becomes the route path naming scheme to be used.

The above would generate a swagger.json such as this (truncated):

```json
  "paths": {
    "/organizations": {
      "parameters": [],
      "get": {
        "operationId": "getOrganizations",
        "summary": "Get Organizations",
        "description": "Get a list of organizations",
        "tags": [],
        "parameters": [
          { "in": "query", "name": "search", "schema": { "type": "string" } },
          { "in": "query", "name": "page", "schema": { "type": "number" } },
          { "in": "query", "name": "limit", "schema": { "type": "number" } }
        ],
        "responses": {
          "200": {
            "description": "Successful organizations retrieval",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "assigned_user_id": {
                        "description": "Assigned user id",
                        "type": "string"
                      },
                      "date_entered": { "type": "string" },
                      "date_modified": { "type": "string" },
                      "created_by": { "type": "string" },
                      "modified_user_id": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
```

By having this documentation defined upfront, we can now use [openapi-typescript](https://www.npmjs.com/package/openapi-typescript) which transforms all of our declared request, responses, params, etc., into valid interfaces.

Example types generated (types.ts):

```ts
export interface operations {
  /** Get a list of organizations */
  getOrganizations: {
    parameters: {
      query: {
        search?: string;
        page?: number;
        limit?: number;
      };
    };
    responses: {
      /** Successful organizations retrieval */
      200: {
        content: {
          "application/json": {
            /** Assigned user id */
            assigned_user_id?: string;
            date_entered?: string;
            date_modified?: string;
            created_by?: string;
            modified_user_id?: string;
          }[];
        };
      };
    };
  };
```

With these defined types, we can now create a generic function to wrap our Express handlers and provide types onto `body`, `params`, `query`, and even `json` returns. This allows us to keep our API in sync with our predefined contract.
