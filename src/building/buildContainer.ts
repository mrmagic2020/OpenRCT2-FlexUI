import { Event } from "@src/utilities/event";
import { BuildOutput } from "./buildOutput";
import { WindowBinder } from "./windowBinder";
import { WindowContext } from "./windowContext";
import { WindowEvent } from "./windowEvent";
import { Template } from "./template";


/**
 * Object that holds components required to build the final window.
 */
export class BuildContainer implements BuildOutput
{
	binder: WindowBinder = new WindowBinder();

	_widgets: Widget[] = [];
	_template: Template;

	open: Event<WindowContext> = [];
	update: Event<WindowContext> = [];
	close: Event<WindowContext> = [];

	constructor(window: WindowDesc)
	{
		this._template = new Template(window, this.binder);
	}

	add(widget: Widget): void
	{
		this._widgets.push(widget);
	}

	on(event: WindowEvent, callback: (context: WindowContext) => void): void
	{
		this[event].push(callback);
	}
}