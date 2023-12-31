import { get_articles } from './articleController.js';
import { get_feeds } from './feedController.js';
import Category from "../model/Category.js";

async function init(req, res) {
	res.json(await get_init_data());
}

async function get_init_data() {
	const categories = await get_categories_feeds_tree();
	const articles = await get_articles();

	return { categories, articles };
}

async function get_categories_feeds_tree() {
	const categories = await Category.find();
	const feeds_lists = await get_feeds();

	let root_feeds;

	// add "feeds" property to categories object
	for (let i = 0; i < categories.length; i++) {
		// turn document into editable js data object
		categories[i] = categories[i].toObject();

		for (const feeds_list of feeds_lists) {
			if (feeds_list._id == null) {
				root_feeds = feeds_list.feeds;
			} else {
				if (categories[i]._id == feeds_list._id.toString()) {
					categories[i].feeds = feeds_list.feeds;
					break;
				}
			}
		}
	}

	const category_tree = [];

	// got root categories (have no parent)
	for (let i = categories.length - 1; i >= 0; i--) {
		if (categories[i].parent == null) {
			category_tree.push(categories[i]);
			categories.splice(i, 1);
		}
	}

	// build tree starting from root
	for (const category_root of category_tree) {
		category_root.sub_categories = get_sub_categories(category_root);
	}

	function get_sub_categories(category) {
		let children = [];

		for (let i = categories.length - 1; i >= 0; i--) {
			if (categories[i].parent.equals(category._id)) {
				children.push(categories[i]);
				categories.splice(i, 1);
			}
		}

		for (const child of children) {
			child.sub_categories = get_sub_categories(child);
		}

		return children;
	};

	const root = {
		_id: 0,
		name: 'root',
		parent: null,
		sub_categories: category_tree,
		feeds: root_feeds,
	};

	return [root];
}

export { init, get_init_data };