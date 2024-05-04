# drizzle-condition
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Simple utilities to define a drizzle-orm condition, without having to import the individual comparator functions. Instead use a single function with logical comparison operators to define the condition.

> [!Warning]
> This library is a work in progress, and is not yet ready for production use.

## Installation

Install the package from npm:

```bash
npm install drizzle-condition
```

## Usage

```ts
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { condition } from "drizzle-condition";

const myTable = sqliteTable("my_table", {
    id: integer("id"), 
});

const myQuery = await myDatabaseConnection.query.myTable.findMany({
    // where: eq(myTable.id, 1), <-- drizzle-orm implementation eq, gt, lt, etc
    where: condition(myTable.id, "==", 1),// <-- drizzle-condition implementation '==', '!=', '>', '<', '>=', '<=' etc
});
```

## Why?

I enjoy using the mathmatical operator syntax when building queries, much like firebase and other ORMs, and found myself writing helpers in all my projects to write the queries in this format. 

Hopefully this library will make it easier for you to write queries this way too.

## API Compatability

| drizzle-orm      | drizzle-condition                    |
| ---------------- | ------------------------------------ |
| eq               | condition(table.column, "==", value) |
| ne               | ⏱️ todo                               |
| gt               | ⏱️ todo                               |
| lt               | ⏱️ todo                               |
| gte              | ⏱️ todo                               |
| lte              | ⏱️ todo                               |
| in               | ⏱️ todo                               |
| isNull           | ⏱️ todo                               |
| isNotNull        | ⏱️ todo                               |
| inArray          | ⏱️ todo                               |
| notInArray       | ⏱️ todo                               |
| exists           | ⏱️ todo                               |
| notExists        | ⏱️ todo                               |
| between          | ⏱️ todo                               |
| notBetween       | ⏱️ todo                               |
| like             | ⏱️ todo                               |
| notLike          | ⏱️ todo                               |
| ilike            | ⏱️ todo                               |
| notIlike         | ⏱️ todo                               |
| not              | ⏱️ todo                               |
| and              | ⏱️ todo                               |
| or               | ⏱️ todo                               |
| arrayContains    | ⏱️ todo                               |
| arrayContainedIn | ⏱️ todo                               |
| arrayOverlaps    | ⏱️ todo                               |

# Contributing

Contributions are welcome!

## Project Structure

Package manager: bun
Test runner: vitest
Linter: biome


## Get stated

1. Fork the repository
2. Install dependencies: `bun install`
3. Check the project is working: `bun run all`
   1. This runs type checking, building, linting and testing. See the `package.json` for more details.

## Making a PR

Create a pull request to the `main` branch from your forked repository.


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!