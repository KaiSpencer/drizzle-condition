import type { SQL } from "drizzle-orm";
import { SQLiteSyncDialect } from "drizzle-orm/sqlite-core";

/**
 * Given `new SQL()` return '"users"."id" = 1' where `1` is parameterized
 */
export function queryAsRawString(query: SQL | undefined): string {
	if (!query) {
		return "";
	}
	const dialect = new SQLiteSyncDialect();
	const queryWithTypings = dialect.sqlToQuery(query);
	let sql = queryWithTypings.sql;
	const params = queryWithTypings.params;
	for (let i = 0; i < params.length; i++) {
		const param = params[i] as Array<string | number>;
		sql = sql.replace("?", param.toString());
	}
	return sql;
}
