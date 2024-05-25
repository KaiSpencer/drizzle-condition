import type { Column, GetColumnData } from "drizzle-orm";
import { convertConditionsArrayToDrizzleConditions } from "./converters";

export type Comparator = "==";
export type Joiners = "&&" | "||";
export type Condition<TColumn extends Column> = [
	TColumn,
	Comparator,
	GetColumnData<TColumn, "raw">,
];
export type JoinedCondition<
	TColumn1 extends Column,
	TColumn2 extends Column,
> = [
	Condition<TColumn1>,
	Joiners,
	JoinedConditionOrCondition<TColumn2, Column>,
];
export type JoinedConditionOrCondition<
	TColumn1 extends Column,
	TColumn2 extends Column,
> = JoinedCondition<TColumn1, TColumn2> | Condition<TColumn1>;

class ConditionBuilder<TColumn1 extends Column, TColumn2 extends Column> {
	private conditions: Array<JoinedConditionOrCondition<TColumn1, TColumn2>> =
		[];

	constructor(
		private readonly column: TColumn1,
		private readonly comparator: Comparator,
		private readonly value: GetColumnData<TColumn2, "raw">,
	) {
		this.conditions.push([this.column, this.comparator, this.value]);
	}
	private joinConditions(
		joiner: Joiners,
		nextCondition: ConditionBuilder<TColumn1, TColumn2>,
	): JoinedConditionOrCondition<TColumn1, TColumn2>[] {
		const nextJoinedCondition =
			nextCondition.conditions.length === 1
				? nextCondition.conditions[0]
				: nextCondition.conditions;

		// TODO: this cast is probably wrong
		const joinedConditions = [...this.conditions, joiner, nextJoinedCondition];
		return joinedConditions as JoinedConditionOrCondition<TColumn1, TColumn2>[];
	}

	and(
		nextCondition: ConditionBuilder<TColumn1, TColumn2>,
	): ConditionBuilder<TColumn1, TColumn2> {
		const joinedCondition = this.joinConditions("&&", nextCondition);

		this.conditions = joinedCondition;
		return this;
	}

	or(
		nextCondition: ConditionBuilder<TColumn1, TColumn2>,
	): ConditionBuilder<TColumn1, TColumn2> {
		const joinedCondition = this.joinConditions("||", nextCondition);
		this.conditions = joinedCondition;
		return this;
	}

	/**
	 * @private
	 * Builds a condition array from the builder
	 */
	_build() {
		return this.conditions;
	}

	/**
	 * Creates the output compatible with drizzle-orm where clauses
	 * ```ts
	 * const table = sqliteTable("users", { id: integer("id") });
	 * const conditions = condition(table.id, "==", 1).and(condition(table.id, "==", 2));
	 * const query = await db.query.users.findMany({ where: conditions.generate() });
	 * ```
	 */
	generate() {
		if (this.conditions.length === 1) {
			return convertConditionsArrayToDrizzleConditions(
				this._build()[0] as JoinedConditionOrCondition<TColumn1, TColumn2>,
			);
		}
		return convertConditionsArrayToDrizzleConditions(
			this._build() as JoinedConditionOrCondition<TColumn1, TColumn2>,
		);
	}
}

export function condition<TColumn extends Column>(
	column: TColumn,
	comparator: Comparator,
	value: GetColumnData<TColumn, "raw">,
): ConditionBuilder<TColumn, Column> {
	return new ConditionBuilder(column, comparator, value);
}
