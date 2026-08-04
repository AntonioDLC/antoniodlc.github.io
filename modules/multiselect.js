export class MultiSelect
{
	constructor(select)
	{
		this.select = select;

		select.hidden = true;

		this.root = document.createElement("div");
		this.root.className = "ms";

		this.button = document.createElement("button");
		this.button.type = "button";

		this.chips = document.createElement("span");
		this.chips.className = "chips";

		const arrow = document.createElement("span");
		arrow.textContent = "▾";

		this.button.append(this.chips, arrow);

		this.popup = document.createElement("div");
		this.popup.className = "popup";
		this.popup.hidden = true;

		for (const option of select.options)
		{
			const label = document.createElement("label");

			const check = document.createElement("input");
			check.type = "checkbox";
			check.checked = option.selected;

			check.addEventListener("change", () =>
			{
				option.selected = check.checked;
				this.render();

				select.dispatchEvent(new Event("change", {bubbles: true}));
			});

			label.append(check, " ", option.text);
			this.popup.append(label);
		}

		this.root.append(this.button, this.popup);

		select.after(this.root);

		this.button.addEventListener("click", e =>
		{
			e.stopPropagation();
			this.popup.hidden = !this.popup.hidden;
		});

		document.addEventListener("click", () =>
		{
			this.popup.hidden = true;
		});

		select.addEventListener("change", () => this.sync());

		this.render();
	}

	sync()
	{
		const checks = this.popup.querySelectorAll("input");

		[...this.select.options].forEach((option, i) =>
		{
			checks[i].checked = option.selected;
		});

		this.render();
	}

	render()
	{
		this.chips.replaceChildren();

		const selected =
			[...this.select.selectedOptions].map(o => o.text);

		if (!selected.length)
		{
			this.chips.textContent = "Select...";
			return;
		}

		selected.forEach(text =>
		{
			const chip = document.createElement("span");
			chip.className = "chip";
			chip.textContent = text;
			this.chips.append(chip);
		});
	}
}