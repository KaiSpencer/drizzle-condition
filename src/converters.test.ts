import { and, eq } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { expect, it } from "vitest";
import { queryAsRawString } from "./_test-utils";
import { convertConditionsArrayToDrizzleConditions } from "./converters";

const table = sqliteTable("users", { id: integer("id"), name: text("name") });

it("single condition", () => {
	const result = convertConditionsArrayToDrizzleConditions([table.id, "==", 1]);
	const expected = eq(table.id, 1);
	expect(queryAsRawString(result)).toEqual(queryAsRawString(expected));
});

it("condition and condition", () => {
	const result = convertConditionsArrayToDrizzleConditions([
		[table.id, "==", 1],
		"&&",
		[table.name, "==", "im a name"],
	]);
	const expected = and(eq(table.id, 1), eq(table.name, "im a name"));
	expect(queryAsRawString(result)).toEqual(queryAsRawString(expected));
});
