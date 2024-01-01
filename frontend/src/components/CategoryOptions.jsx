import { useState } from "react";

export default function CategoryOptions({ categoryId }) {
	const [loading, setLoading] = useState();
	const [error, setError] = useState();
	const [categoryName, setCategoryName] = useState();
	const [feedName, setFeedName] = useState();
	const [feedURL, setFeedURL] = useState();

	async function handleCreatingFeed(e)
	{
		e.preventDefault();

		try {
			const response = await fetch("http://127.0.0.1:35000/create_feed", {
				method: "POST",
				body: JSON.stringify({
					name: feedName,
					url: feedURL,
					categoryId: categoryId,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`This is an HTTP error: The status is ${response.status}`
				);
			}

			let actualData = await response.json();
			console.log(actualData);

			setError(null);
		} catch (err) {
			setError(err.message);
			console.log(err);
		} finally {
			setLoading(false);
		}
	}

	async function handleCreatingCategory(e) {
		e.preventDefault();

		try {
			const response = await fetch("http://127.0.0.1:35000/create_category", {
				method: "POST",
				body: JSON.stringify({
					name: categoryName,
					parent: categoryId,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`This is an HTTP error: The status is ${response.status}`
				);
			}

			let actualData = await response.json();
			console.log(actualData);

			setError(null);
		} catch (err) {
			setError(err.message);
			console.log(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<form>
				<div>Add New Category</div>
				<input
					type="text"
					name=""
					id=""
					placeholder="Category Name"
					onChange={(e) => setCategoryName(e.target.value)}
				/>
				<button type="submit" onClick={handleCreatingCategory}>
					Create
				</button>
			</form>

			<form>
				<div>Add New Feed</div>
				<input
					type="text"
					name=""
					id=""
					placeholder="Feed Name"
					onChange={(e) => setFeedName(e.target.value)}
				/>
				<input
					type="text"
					name=""
					id=""
					placeholder="Feed URL"
					onChange={(e) => setFeedURL(e.target.value)}
				/>

				<button type="submit" onClick={handleCreatingFeed}>
					Add
				</button>
			</form>
		</div>
	);
}
