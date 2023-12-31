import Category from "../model/Category.js";

const add_category = async (category) => {
	try {
		const result = await Category.create({
			name: category.name,
			parent: category.parent,
		});

		return result;
	} catch (err) {
		console.error(err);
	}
};

async function create_category(req, res) {
	const result = await add_category({ name: req.body.name, parent: req.body.parent });

	res.status(200).send(result);
}

export { add_category, create_category };