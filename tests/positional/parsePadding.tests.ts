/// <reference path="../../lib/openrct2.d.ts" />

import { defaultScale } from "@src/elements/constants";
import { applyPadding } from "@src/elements/layouts/paddingHelpers";
import { ParsedPadding } from "@src/positional/parsing/parsedPadding";
import { parsePadding } from "@src/positional/parsing/parsePadding";
import { ScaleType } from "@src/positional/parsing/scaleType";
import { Rectangle } from "@src/positional/rectangle";
import test from "ava";


test("Apply no padding", t =>
{
	const area: Rectangle = { x: 10, y: 20, width: 100, height: 200 };

	const padding: ParsedPadding = parsePadding(0);
	applyPadding(area, defaultScale, defaultScale, padding);

	t.is(area.x, 10);
	t.is(area.y, 20);
	t.is(area.width, 100);
	t.is(area.height, 200);
});


test("Apply basic padding", t =>
{
	const area: Rectangle = { x: 10, y: 20, width: 100, height: 200 };

	const padding: ParsedPadding = parsePadding(5);
	applyPadding(area, defaultScale, defaultScale, padding);

	t.is(area.x, 15);
	t.is(area.y, 25);
	t.is(area.width, 90);
	t.is(area.height, 190);
});


test("Apply horizontal and vertical padding", t =>
{
	const area: Rectangle = { x: 10, y: 20, width: 100, height: 200 };

	const padding: ParsedPadding = parsePadding([20, 15]);
	applyPadding(area, defaultScale, defaultScale, padding);

	t.is(area.x, 25);
	t.is(area.y, 40);
	t.is(area.width, 70);
	t.is(area.height, 160);
});


test("Apply weighted padding", t =>
{
	const area: Rectangle = { x: 10, y: 20, width: 77, height: 200 };

	const padding: ParsedPadding = parsePadding({ top: "1w", right: "2w", bottom: "3w", left: "4w" });
	applyPadding(area, defaultScale, defaultScale, padding);

	t.is (area.x, 10 + 44);
	t.is(area.y, 20 + 40);
	t.is(area.width, 11);
	t.is(area.height, 40);
});


test("Apply weighted padding with absolute child content", t =>
{
	const area: Rectangle = { x: 10, y: 20, width: 100, height: 200 };

	const padding: ParsedPadding = parsePadding({ top: "1w", right: "2w", bottom: "3w", left: "4w" });
	applyPadding(area, [70, ScaleType.Pixel], [20, ScaleType.Pixel], padding);

	t.is(area.x, 10 + 20);
	t.is(area.y, 20 + 45);
	t.is(area.width, 70);
	t.is(area.height, 20);
});