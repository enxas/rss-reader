import fs from 'fs/promises';

import Article from "../model/Article.js";
import Category from "../model/Category.js";
import Feed from "../model/Feed.js";
import { add_category } from "./categoryController.js";
import { add_feed } from "./feedController.js";
import XmlParser from "../libraries/xml-parser.js";
import { get_init_data } from './initController.js';
import tag from '../libraries/data-to-xml.js';

async function import_opml_file(req, res) {

	await clear_db_before_import();

	const feeds_text = await fs.readFile(req.file.path, { encoding: "utf8" }).catch(e => console.error(e));

	const parser = new XmlParser();

	const feeds_json = await parser.parse(feeds_text);

	let feed_objects;

	for (const opml of feeds_json.root.children) {
		if (opml.name == "body") {
			feed_objects = opml.children;
			break;
		}
	}

	for (const feed_obj of feed_objects) {
		await create_categories_and_feeds(feed_obj, null);
	}

	res.json({ message: "Successfully uploaded files" });
}

async function create_categories_and_feeds(element, parent_category_id) {
	// if element has attribute "xmlUrl" then it's a feed, othervise it's a category
	if (element?.attributes?.xmlUrl) {
		await add_feed({
			name: element.attributes.text,
			url: element.attributes.xmlUrl,
			category: parent_category_id,
		});
	} else {
		let category = await add_category({
			name: element.attributes.text,
			parent: parent_category_id,
		});

		if (element.children && element.children.length > 0) {
			for (const children of element.children) {
				await create_categories_and_feeds(children, category._id);
			}
		}
	}
};

async function clear_db_before_import() {
	await Article.deleteMany();
	await Feed.deleteMany();
	await Category.deleteMany();
}

function generateTagsTree(categoriesArray) {
	let parent = tag('outline', { 'text': `${categoriesArray.name}` });

	for (const feed of categoriesArray.feeds ?? []) {
		parent.children.push(tag('outline', {
			encoding: "UTF-8",
			type: "rss",
			version: "ATOM",
			text: feed.name,
			title: feed.name,
			xmlUrl: feed.url,
		}));
	}

	for (const category of categoriesArray.sub_categories) {
		parent.children.push(generateTagsTree(category));
	}

	return parent;
}

async function export_feeds(req, res) {
	const data = await get_init_data();

	const prologue = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<opml version="2.0">
  <head>
    <title>RSS Reader</title>
  </head>
  <body>
`;

	const epilogue = `
  </body>
</opml>`;

	const lines = generateTagsTree(data.categories[0]).getXML().split('\n');

	// Remove the first line
	lines.shift();

	// Remove the last two lines
	lines.splice(-2);

	// Join the remaining lines back into a string
	const content = lines.join('\n');

	res.setHeader('Content-type', "application/octet-stream");

	res.send(prologue + content + epilogue);
}

export { import_opml_file, export_feeds };