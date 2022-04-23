/// <reference path="../../../lib/openrct2.d.ts" />

import { store } from "@src/bindings/stores/createStore";
import { window } from "@src/building/window";
import { viewport, ViewportFlags } from "@src/elements/controls/viewport";
import test from "ava";
import Mock, { UiMock } from "openrct2-mocks";
import { call } from "tests/helpers";


test("Standard properties are set", t =>
{
	const mock = Mock.ui();
	global.ui = mock;

	const template = window({
		width: 100, height: 100,
		content: [
			viewport({
				target: { x: 22, y: 88, z: 123 },
				rotation: 3,
				zoom: -2,
				visibilityFlags: ViewportFlags.Gridlines | ViewportFlags.InvisiblePeeps,
				tooltip: "view this"
			})
		]
	});
	template.open();

	const widget = mock.createdWindows[0].widgets[0] as ViewportWidget;
	t.is(widget.type, "viewport");
	t.is(widget.tooltip, "view this");
	const vp = widget.viewport;
	t.is(vp?.rotation, 3);
	t.is(vp?.zoom, -2);
	t.is(vp?.visibilityFlags, ViewportFlags.Gridlines | ViewportFlags.InvisiblePeeps);
	t.is(vp?.left, 22 - 50);
	t.is(vp?.bottom, 88 - 50);
});


test("Viewport updates on store update", t =>
{
	const mock = Mock.ui();
	global.ui = mock;

	const target = store<CoordsXY>({ x: 10, y: 20 });
	const template = window({
		width: 100, height: 100,
		content: [
			viewport({ target: target })
		]
	});
	template.open();

	const created = (global.ui as UiMock).createdWindows[0];
	call(created.onUpdate);

	const widget = created.widgets[0] as ViewportWidget;
	const vp = widget.viewport;
	t.is(vp?.left, 10 - 50);
	t.is(vp?.bottom, 20 - 50);

	target.set({ x: -900, y: 550 });
	call(created.onUpdate);

	t.is(vp?.left, -900 - 50);
	t.is(vp?.bottom, 550 - 50);
});