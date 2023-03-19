import { isFunction, isObject } from "@src/utilities/type";
import { TwoWayBinding } from "./twowayBinding";


/**
 * Returns true if the target is a two-way binding or follows the two-way binding contract. Returns false if not.
 */
export function isTwoWay(target: unknown): target is TwoWayBinding<unknown>
{
	if (!target || !isObject(target))
		return false;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return isFunction((target as any).twoway);
}