import { Bindable } from "@src/bindings/bindable";
import { Binder } from "@src/bindings/binder";
import { Binding } from "@src/bindings/binding";
import { Store } from "@src/bindings/stores/store";
import { isTwoWay } from "@src/bindings/twoway/isTwoWay";
import { TwoWayBindable } from "@src/bindings/twoway/twowayBindable";
import { isUndefined } from "@src/utilities/type";
import { isStore } from "../../bindings/stores/isStore";


/**
 * Generic binder that can bind to a specific target.
 */
export abstract class GenericBinder<TSource, TTarget> implements Binder<TTarget>
{
	protected readonly _bindings: Binding<TTarget, unknown>[] = [];
	protected _source: TSource | null = null;


	add<T extends TTarget, K extends keyof T, V>(target: T, key: K, value: Bindable<V> | undefined, converter?: (value: V) => T[K]): void
	{
		this.on(target, value, (actualTarget, actualValue) =>
		{
			const result = (converter) ? converter(actualValue) : actualValue;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(<any>actualTarget)[key] = result;
		});
	}

	twoway<T extends TTarget, I extends keyof T, V extends T[I]>(target: T, inKey: I, outKey: keyof T, value: TwoWayBindable<V> | undefined, callback: ((arg: V) => void) | undefined): void
	{
		this.add(target, inKey, value);
		if (isTwoWay(value))
		{
			target[outKey] = <T[keyof T]>((arg: V): void =>
			{
				value.twoway.set(arg);
				if (callback)
				{
					callback(arg);
				}
			});
		}
		else if (callback)
		{
			target[outKey] = <T[keyof T]>callback;
		}
	}

	on<T extends TTarget, V>(target: T, value: Bindable<V> | undefined, callback: (target: T, value: V) => void): void
	{
		if (isStore(value))
		{
			// bind
			const binding = this._createBinding(target, value, callback);
			this._bindings.push(<never>binding);

			callback(target, value.get());
		}
		else if (!isUndefined(value))
		{
			// just update value
			callback(target, value);
		}
	}

	/**
	 * Add a binding callback between a store and a target's property. An optional converter can be
	 * supplied if the value needs to be converted from an internal value to a different visual
	 * representation of it.
	 */
	protected abstract _createBinding<T extends TTarget, V>(target: T, store: Store<V>, callback: (target: T, value: V) => void): Binding<T, V>;

	/**
	 * Bind a source instance to this binder.
	 */
	abstract _bind(source: TSource): void;


	/**
	 * Unbind the current window from this binder.
	 */
	_unbind(): void
	{
		this._source = null;
	}

	/**
	 * Returns true if the binder has any bindings, or false if not.
	 */
	_hasBindings(): boolean
	{
		return (this._bindings.length > 0);
	}
}
