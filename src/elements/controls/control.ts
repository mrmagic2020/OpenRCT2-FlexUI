import { on } from "@src/bindings/stores/on";
import { Rectangle } from "@src/positional/rectangle";
import { identifier } from "@src/utilities/identifier";
import * as Log from "@src/utilities/logger";
import { BuildOutput } from "@src/windows/buildOutput";
import { ParentControl } from "@src/windows/parentControl";
import { WidgetMap } from "@src/windows/widgets/widgetMap";
import { ElementParams } from "../elementParams";
import { fillLayout } from "../layouts/fillLayout";
import { VisualElement } from "./visualElement";


/**
 * Base control that takes care of the base widget properties.
 */
export abstract class Control<W extends WidgetBaseDesc, Positioning, ParsedPosition> extends VisualElement<Positioning, ParsedPosition> implements WidgetBaseDesc
{
	name: string = identifier();
	type: W["type"];
	x: number;
	y: number;
	width: number;
	height: number;

	tooltip?: string;
	isDisabled?: boolean;
	isVisible?: boolean;


	constructor(type: W["type"], parent: ParentControl<Positioning, ParsedPosition>, output: BuildOutput, params: ElementParams & Positioning)
	{
		super(parent, params);
		this.type = type;
		this.x = this.y = this.width = this.height = 0;

		const { binder, context } = output, visibility = params.visibility;
		binder.add(this, "tooltip", params.tooltip);
		binder.add(this, "isDisabled", params.disabled);
		binder.add(this, "isVisible", visibility, v => (v === "visible"));

		// Redraw UI if the visibility changes to and from "none"
		on(visibility, v =>
		{
			const oldValue = this.skip;
			const newValue = (v === "none");
			this.skip = newValue;

			if (oldValue || newValue)
			{
				Log.debug("Control(", this.type, ":", this.name, "): skip changed from", oldValue, "to", newValue);
				parent.recalculate();
				context.redraw();
			}
		});

		output.add(this);
	}


	override layout(widgets: WidgetMap, area: Rectangle): void
	{
		Log.debug("Control(", this.type, ":", this.name, ") layout() for area:", Log.stringify(area));
		fillLayout(widgets, this.name, area);
	}
}
