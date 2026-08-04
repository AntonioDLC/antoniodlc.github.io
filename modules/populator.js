function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function getValue(data, path)
{
	let ret = data;

	for(const key of path.split("."))
	{
		if(!ret)
			break;
		
		ret = ret[key];
	}

	return ret;
}

function isIterable(obj)
{
	return obj && obj.length && typeof obj !== "string";
}

function instanceTemplate(template, value)
{
	const frag = document.importNode(template.content, true);
	populate(frag, value);
	return frag;
}

function appendTemplateList(dataElem, template, value)
{
	for(const item of value)	
	{
		const li = document.createElement("li");
		li.appendChild(
			instanceTemplate(template, item)
		);
		dataElem.appendChild(li);
	}
}

export function populate(node, data) //Note: recursive function
{
	const dataFieldElems = node.querySelectorAll("[data-field]");
	for(const dataFieldElem of dataFieldElems)
	{
		const fieldPath = dataFieldElem.getAttribute("data-field");
		const value = getValue(data, fieldPath);
		const templateID = dataFieldElem.getAttribute("data-template");
		if(templateID)
		{
			const template = document.getElementById(templateID);
			if(template) 	
				if(isIterable(value))
					appendTemplateList(dataFieldElem, template, value);
				else if(dataFieldElem.matches("ul, ol, dl"))
				{
					const entries = Object.entries(value).map(e => ({key:e[0],value:e[1]}));
					appendTemplateList(dataFieldElem, template, entries);
				}
				else
					dataFieldElem.appendChild(instanceTemplate(template, value));
			else
				console.error("Couldn't find template with ID:<%s>", templateID);
		}
		else if(isIterable(value))
			for(const item of value)
			{
				const li = document.createElement("li");
				li.innerHTML = capitalizeFirstLetter(item);
				dataFieldElem.appendChild(li);
			}
		else if(value && dataFieldElem.matches("time"))
			 dataFieldElem.innerHTML = new Date(value.year, value.month-1).toLocaleString(undefined,{month:'short', year:'numeric'});
		else if(!value)
			dataFieldElem.parentNode.closest("[data-stump]").remove();
		else dataFieldElem.innerHTML = fieldPath == "key" ? capitalizeFirstLetter(value) : String(value);
	}

	const dataURLElems = node.querySelectorAll("[data-url]");
	for(const dataURLElem of dataURLElems)
	{
		const fieldPath = dataURLElem.getAttribute("data-url");
		const url = getValue(data, fieldPath);

		if(!dataURLElem.innerHTML)
			dataURLElem.innerHTML = url;

		if(url.includes("@"))
			dataURLElem.setAttribute("href", "mailto:"+url);
		else
			dataURLElem.setAttribute("href", url);
	}
}