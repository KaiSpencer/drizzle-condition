import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { expect, it } from "vitest";
import { condition } from ".";

it("smoke", () => {
	const output = condition(
		sqliteTable("users", { id: integer("id") }).id,
		"==",
		1,
	);
	expect(output.getSQL()).toHaveProperty("queryChunks");
});
