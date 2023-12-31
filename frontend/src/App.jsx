import { useState, useEffect } from "react";

import "./App.css";
import CategoryItem from "./components/CategoryItem";
import ArticleList from "./components/ArticleList";
import SingleFileUploader from "./components/SingleFileUploader";
import FeedList from "./components/FeedList";
import CategoryOptions from "./components/CategoryOptions";

function App() {
	const [rssData, setRssData] = useState();
	const [currentArticles, setCurrentArticles] = useState();
	const [error, setError] = useState();
	const [loading, setLoading] = useState();
	const [categoryOptionData, setCategoryOptionData] = useState({
		isShow: false,
		categoryId: null,
	});

	const [sortDirection] = useState("desc");

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await fetch(`http://127.0.0.1:3500/all`);

				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}

				let actualData = await response.json();
				// console.log(actualData);

				setRssData(actualData);

				setError(null);
			} catch (err) {
				setError(err.message);
				console.log(err);
			} finally {
				setLoading(false);
			}
		};
		getData();
	}, []);

	// Function to handle the sorting
	const handleSort = (data) => {
		const sortedData = [...data];
		sortedData.sort((a, b) => {
			const dateA = new Date(a.published);
			const dateB = new Date(b.published);
			return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
		});

		// setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		return sortedData;
	};

	const categoryOptions = (categoryId) => {
		console.log(categoryId);
		setCategoryOptionData((prevData) => ({
			...prevData,
			categoryId,
			isShow: true,
		}));
	};

	const selectedFeed = (feedItemCallback, articles) => {
		articles = handleSort(articles);

		setCurrentArticles({ feedItemCallback, articles });
	};

	const mark_all_read = async () => {
		try {
			const response = await fetch(`http://127.0.0.1:3500/mark_all_read`);

			if (!response.ok) {
				throw new Error(
					`This is an HTTP error: The status is ${response.status}`
				);
			}

			
		} catch (err) {
			console.log(err);
		}
	};

	const export_articles = async () => {
		try {
			const response = await fetch(`http://127.0.0.1:3500/export`);

			if (!response.ok) {
				throw new Error(
					`This is an HTTP error: The status is ${response.status}`
				);
			}

			var file = await response.blob();
			var fileURL = URL.createObjectURL(file);

			// create <a> tag dinamically
			var fileLink = document.createElement("a");
			fileLink.href = fileURL;

			// it forces the name of the downloaded file
			fileLink.download = `feeds_${
				new Date().toISOString().split("T")[0]
			}.opml`;

			// triggers the click event
			fileLink.click();
		} catch (err) {
			console.log(err);
		}
	};

	const fetch_new_articles = async () => {
		try {
			const response = await fetch(`http://127.0.0.1:3500/fetch_new_articles`);

			if (!response.ok) {
				throw new Error(
					`This is an HTTP error: The status is ${response.status}`
				);
			}

			let actualData = await response.json();

			setRssData(actualData);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<div className="App">
				<h1>API Posts</h1>
				{loading && <div>A moment please...</div>}

				{error && (
					<div>{`There is a problem fetching the post data - ${error}`}</div>
				)}

				<SingleFileUploader />

				<div className="my-container">
					<aside>
						<button onClick={fetch_new_articles}>Fetch new articles</button>
						<button onClick={export_articles}>Export</button>
						<button onClick={mark_all_read}>Mark All Read</button>
						<ul>
							{rssData &&
								rssData.categories[0].sub_categories.map((category) => {
									return (
										<CategoryItem
											item={category}
											key={category._id}
											selectedFeed={selectedFeed}
											articles={rssData.articles}
											categoryOptions={categoryOptions}
										/>
									);
								})}

							{rssData && (
								<FeedList
									articles={rssData.articles}
									feeds={rssData.categories[0].feeds}
									selectedFeed={selectedFeed}
								/>
							)}
						</ul>
					</aside>

					<main>
						<ArticleList articles={currentArticles} />
					</main>
				</div>

				{}
			</div>

			{categoryOptionData.isShow && (
				<CategoryOptions categoryId={categoryOptionData.categoryId} />
			)}
		</>
	);
}

export default App;
