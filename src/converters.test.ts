import { expect, it } from "vitest";
import { convertConditionsArrayToDrizzleConditions } from "./converters";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { eq, and } from "drizzle-orm";
import { queryAsRawString } from "./_test-utils";

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
