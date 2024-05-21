import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { describe, expectTypeOf, it } from "vitest";
import { type Comparator, condition } from ".";

it("column is inferred", () => {
	const testTable = sqliteTable("table", { id: integer("id") });
	const test = condition<typeof testTable.id>;
	expectTypeOf(condition<typeof testTable.id>).toBeFunction();
	expectTypeOf(test).parameter(0).toHaveProperty("columnType").toBeString();
});

it("supported comparators", () => {
	const testTable = sqliteTable("table", { id: integer("id") });
	const test = condition<typeof testTable.id>;
	expectTypeOf(condition<typeof testTable.id>).toBeFunction();
	expectTypeOf(test).parameter(1).toEqualTypeOf<Comparator>();
});

describe("sqlite column types", () => {
	it("value has correct type for column integer", () => {
		const testTable = sqliteTable("table", { id: integer("id") });
		const test = condition<typeof testTable.id>;
		expectTypeOf(test).parameter(2).toEqualTypeOf<number>();
	});

	it("value has correct type for text", () => {
		const testTable = sqliteTable("table", { id: text("id") });
		const test = condition<typeof testTable.id>;
		expectTypeOf(test).parameter(2).toEqualTypeOf<string>();
	});

	it("value has correct type for timestamp_ms", () => {
		const testTable = sqliteTable("table", {
			id: integer("id", { mode: "timestamp_ms" }),
		});
		const test = condition<typeof testTable.id>;
		expectTypeOf(test).parameter(2).toEqualTypeOf<Date>();
	});

	it("value has correct type for timestamp", () => {
		const testTable = sqliteTable("table", {
			id: integer("id", { mode: "timestamp" }),
		});
		const test = condition<typeof testTable.id>;
		expectTypeOf(test).parameter(2).toEqualTypeOf<Date>();
	});

	it("value has correct type for boolean", () => {
		const testTable = sqliteTable("table", {
			id: integer("id", { mode: "boolean" }),
		});
		const test = condition<typeof testTable.id>;
		expectTypeOf(test).parameter(2).toEqualTypeOf<boolean>();
	});
	it("value has correct type for explicit number", () => {
		const testTable = sqliteTable("table", {
			id: integer("id", { mode: "number" }),
		});
		const test = condition<typeof testTable.id>;
		expectTypeOf(test).parameter(2).toEqualTypeOf<number>();
	});
});
