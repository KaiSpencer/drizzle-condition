import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { describe, expect, it } from "vitest";
import { condition } from ".";
import { and, eq } from "drizzle-orm";
import { queryAsRawString } from "./_test-utils";

it("cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1);

	expect(conditions._build()).toEqual([[table.id, "==", 1]]);
});

it("cond and cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1).and(
		condition(table.id, "==", 2),
	);

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[table.id, "==", 2],
	]);
});

it("cond or cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1).or(
		condition(table.id, "==", 2),
	);

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"||",
		[table.id, "==", 2],
	]);
});

it("cond and (cond and cond)", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1).and(
		condition(table.id, "==", 2).and(condition(table.id, "==", 3)),
	);

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[[table.id, "==", 2], "&&", [table.id, "==", 3]],
	]);
});

it("cond and (cond or cond)", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1).and(
		condition(table.id, "==", 2).or(condition(table.id, "==", 3)),
	);

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[[table.id, "==", 2], "||", [table.id, "==", 3]],
	]);
});

it("cond or (cond and cond)", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1).or(
		condition(table.id, "==", 2).and(condition(table.id, "==", 3)),
	);

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"||",
		[[table.id, "==", 2], "&&", [table.id, "==", 3]],
	]);
});

it("cond or (cond or cond)", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1).or(
		condition(table.id, "==", 2).or(condition(table.id, "==", 3)),
	);

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"||",
		[[table.id, "==", 2], "||", [table.id, "==", 3]],
	]);
});

it("cond and (cond and cond) and cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1)
		.and(condition(table.id, "==", 2).and(condition(table.id, "==", 3)))
		.and(condition(table.id, "==", 4));

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[[table.id, "==", 2], "&&", [table.id, "==", 3]],
		"&&",
		[table.id, "==", 4],
	]);
});

it("cond and (cond and cond) or cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1)
		.and(condition(table.id, "==", 2).and(condition(table.id, "==", 3)))
		.or(condition(table.id, "==", 4));

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[[table.id, "==", 2], "&&", [table.id, "==", 3]],
		"||",
		[table.id, "==", 4],
	]);
});

it("cond or (cond and cond) and cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1)
		.or(condition(table.id, "==", 2).and(condition(table.id, "==", 3)))
		.and(condition(table.id, "==", 4));

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"||",
		[[table.id, "==", 2], "&&", [table.id, "==", 3]],
		"&&",
		[table.id, "==", 4],
	]);
});

it("cond or (cond and cond) or cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1)
		.or(condition(table.id, "==", 2).and(condition(table.id, "==", 3)))
		.or(condition(table.id, "==", 4));

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"||",
		[[table.id, "==", 2], "&&", [table.id, "==", 3]],
		"||",
		[table.id, "==", 4],
	]);
});

it("cond and (cond or (cond and cond)) and cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1)
		.and(
			condition(table.id, "==", 2).or(
				condition(table.id, "==", 3).and(condition(table.id, "==", 4)),
			),
		)
		.and(condition(table.id, "==", 5));

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[
			[table.id, "==", 2],
			"||",
			[[table.id, "==", 3], "&&", [table.id, "==", 4]],
		],
		"&&",
		[table.id, "==", 5],
	]);
});

it("cond and (cond or (cond and cond)) or cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1)
		.and(
			condition(table.id, "==", 2).or(
				condition(table.id, "==", 3).and(condition(table.id, "==", 4)),
			),
		)
		.or(condition(table.id, "==", 5));

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[
			[table.id, "==", 2],
			"||",
			[[table.id, "==", 3], "&&", [table.id, "==", 4]],
		],
		"||",
		[table.id, "==", 5],
	]);
});

it("(cond and cond) or cond", () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1)
		.and(condition(table.id, "==", 2))
		.or(condition(table.id, "==", 3));

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[table.id, "==", 2],
		"||",
		[table.id, "==", 3],
	]);
});

it("cond and ((cond and cond) or cond) or cond", { todo: true }, () => {
	const table = sqliteTable("users", { id: integer("id") });
	const conditions = condition(table.id, "==", 1)
		.and(
			condition(table.id, "==", 2).and(
				condition(table.id, "==", 3).or(condition(table.id, "==", 4)),
			),
		)
		.or(condition(table.id, "==", 5));

	console.log(conditions._build());

	expect(conditions._build()).toEqual([
		[table.id, "==", 1],
		"&&",
		[[table.id, "==", 2], "&&", [table.id, "==", 3]],
		"||",
		[table.id, "==", 4],
		"||",
		[table.id, "==", 5],
	]);
});

describe("generated conditions", () => {
	it("single generated condition", () => {
		const table = sqliteTable("users", { id: integer("id") });
		const out = condition(table.id, "==", 1);
		expect(queryAsRawString(out.generate())).toEqual(
			queryAsRawString(eq(table.id, 1)),
		);
	});

	it("cond and cond", () => {
		const table = sqliteTable("users", { id: integer("id") });
		const out = condition(table.id, "==", 1).and(condition(table.id, "==", 2));
		expect(queryAsRawString(out.generate())).toEqual(
			queryAsRawString(and(eq(table.id, 1), eq(table.id, 2))),
		);
	});

	it("cond and (cond and cond)", () => {
		const table = sqliteTable("users", { id: integer("id") });
		const out = condition(table.id, "==", 1).and(
			condition(table.id, "==", 2).and(condition(table.id, "==", 3)),
		);
		expect(queryAsRawString(out.generate())).toEqual(
			queryAsRawString(
				and(eq(table.id, 1), and(eq(table.id, 2), eq(table.id, 3))),
			),
		);
	});
});
