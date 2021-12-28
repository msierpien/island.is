# Clients Syslumenn

## About

This library implements a client to use Syslumenn's API

The client is generated from a copy of the openApi document provided by Syslumenn.

## Usage

### Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-syslumenn:update-openapi-document
```

### Regenerating the client:

```sh
yarn nx run clients-syslumenn:schemas/external-openapi-generator
```

### Import into other NestJS modules

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-og-kaos/members)
