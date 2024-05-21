import { type Column, type SQL, and, eq, or } from "drizzle-orm";
import type { Condition, JoinedConditionOrCondition } from ".";

export function convertConditionsArrayToDrizzleConditions<
	TColumn1 extends Column,
	TColumn2 extends Column,
>(joinedConditionsOrCondition: JoinedConditionOrCondition<TColumn1, TColumn2>) {
	if (joinedConditionsOrCondition["1"] === "==") {
		const condition = joinedConditionsOrCondition; // TODO: make ts magic here?
		switch (condition[1]) {
			case "==":
				return eq(condition[0], condition[2]);
			default:
				throw new Error(`Unsupported comparator ${condition[1]}`);
		}
	}
	const [condition, joiner, ...rest] = joinedConditionsOrCondition;
	if (rest[0][1] === "==") {
		const left = singleConditionToDrizzleCondition(condition);
		const right = singleConditionToDrizzleCondition(rest[0]);
		switch (joiner) {
			case "&&":
				return and(left, right);
			case "||":
				return or(left, right);
			default:
				throw new Error(`Unsupported joiner ${joiner}`);
		}
	}
	throw new Error("Not implemented");
}

function singleConditionToDrizzleCondition<TColumn extends Column>(
	condition: Condition<TColumn>,
): SQL {
	switch (condition[1]) {
		case "==":
			return eq(condition[0], condition[2]);
		default:
			throw new Error(`Unsupported comparator ${condition[1]}`);
	}
}
