export default function tag(tag, attributes, children = []) {
	const obj = { tag, attributes, children };

	obj.getXML = (nestingLvl = 2) => {
		const { tag, attributes, children } = obj;

		let html = `${' '.repeat(nestingLvl)}<${tag}`;

		// Add attributes
		if (attributes) {
			for (const key in attributes) {
				html += ` ${key}="${attributes[key]}"`;
			}
		}

		if (Array.isArray(children) && children.length === 0) {
			html += "/>\n";
		} else {
			html += ">\n";
		}

		if (typeof children === 'string') {
			// Add content
			if (children) {
				html += children;
			}
		} else if (Array.isArray(children) && children.length > 0) {
			// Process children recursively
			for (const child of children) {
				html += child.getXML(nestingLvl + 2);
			}
		}

		if ((Array.isArray(children) || typeof children === 'string') && children.length > 0) {
			html += `${' '.repeat(nestingLvl)}</${tag}>\n`;
		}

		return html;
	};

	return obj;
}