import { type Column, type GetColumnData, and, eq } from "drizzle-orm";

export type Comparators = "==";

export function condition<const TColumn extends Column>(
	...args: [TColumn, Comparators, GetColumnData<TColumn, "raw">]
) {
	const [column, comparator, value] = args;
	switch (comparator) {
		case "==":
			return eq<TColumn>(column, value);
		default:
			throw new Error(`Unsupported comparator: '${comparator}'`);
	}
}
