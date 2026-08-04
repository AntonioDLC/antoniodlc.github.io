import * as Populator from "./populator.js";
import { MultiSelect } from "./multiselect.js";

function collectTags(obj) {
	const tags = [];

	function walk(value) {
		if (Array.isArray(value)) {
			for (const item of value)
				walk(item);
		} else if (value && typeof value === "object") {
			if (Array.isArray(value.tags))
				tags.push(...value.tags);

			for (const child of Object.values(value))
				walk(child);
		}
	}

	walk(obj);
	return tags;
}

fetch("data.json").then(r => r.text()).then(t => 
{
	const data = JSON.parse(t);
	const uniqueTags = [...new Set(collectTags(data))];
	for(const tag of uniqueTags)
	{
		const option = document.createElement("option");
		option.value = tag;
		option.innerHTML = tag;
		tagFilter.appendChild(option);
	}

	const allOption = document.createElement("option");
	allOption.innerHTML = "all";
	allOption.selected = true;
	tagFilter.appendChild(allOption);

	tagFilter.onchange = function (e)
	{
		const selectedTags = [...tagFilter.selectedOptions].map(option => option.value);
		const tagsElems = document.querySelectorAll("[data-field=\"tags\"]");
		for(const tagElem of tagsElems)
		{
			const article = tagElem.closest("article");
			article.setAttribute("disabled","");

			const details = article.querySelector("details");
			details.removeAttribute("open");

			const tags = [...tagElem.querySelectorAll("li")].map(li => li.innerHTML.toLowerCase());
			if(selectedTags.includes("all") || tags.some(tag => selectedTags.includes(tag)))
			{
				article.removeAttribute("disabled");
				details.setAttribute("open","");
			}
		}
	}

	document.querySelectorAll("select[multiple]")
		.forEach(select => new MultiSelect(select));

	Populator.populate(document, data);
});