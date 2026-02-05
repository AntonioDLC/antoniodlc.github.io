var normalHighlight = new Highlight();
CSS.highlights.set("normal-highlight", normalHighlight);

var selectedHighlight = new Highlight();
CSS.highlights.set("selected-highlight", selectedHighlight);

function startTextHighlighting()
{
	let range = selection.getRangeAt(0);
	
	normalHighlight.add(range);

	let getCommonAncestorElement = function (range) {
		let node = range.commonAncestorContainer;
		while(node.nodeType != 1)
			node = node.parentNode;
		return node;
	};
	let ancestor = getCommonAncestorElement(range);
	ancestor.addEventListener("mousemove", (e) => {
		const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
		if (!pos) return;
		if(range.isPointInRange(pos.offsetNode, pos.offset))
		{
			selectedHighlight.add(range);
			normalHighlight.delete(range);
		}
		else
		{
			normalHighlight.add(range);
			selectedHighlight.delete(range);
		}
	});
	ancestor.addEventListener("mouseleave", (e) => {
		normalHighlight.add(range);
		selectedHighlight.delete(range);
	});	
}

function startHighlighting()
{
	isInHighlightMode = true;
	let selection = getSelection();
	if(0 < selection.rangeCount)
	{
		startTextHighlighting();
	}
};

addEventListener("pointerdown", (e) => {
	let selection = getSelection();
	if(0 < selection.rangeCount)
	{
		let range = selection.getRangeAt(0);
		const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
		if (!pos) return;
		if(range.isPointInRange(pos.offsetNode, pos.offset))
		{
			selectedHighlight.add(range);
			normalHighlight.delete(range);
		}
	}
});

/*
var timeoutID = 0;
function clearHighlightTimeout()
{
	clearTimeout(timeoutID);
	timeoutID = 0;
}
function startHighlightTimeout()
{
	timeoutID = setTimeout(function()
	{
		timeoutID = 0;
		startHighlighting();
	}, 500);
}
addEventListener("pointerdown", (e) => {if(e.isPrimary)	startHighlightTimeout(); else clearHighlightTimeout(); });
addEventListener("pointerup", clearHighlightTimeout);*/