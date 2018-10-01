[Live demo!](benpong.com/sky_view)

![alt text](https://github.com/Benpong89/sky_view/blob/master/lib/port04%20copy.png)

Single page Javascript game. Incorporates Canvas and Javascript logic to achieve a nostalgic arcade-shooter user experience. Utilizes Google Firebase to store high scores.

The core of features of this app include Canvas shapes and sprites rendering, JS logic to incorporate collisions, and key input handling for user game play.

Home Court is a single page sports news app that can be used to search for real live news from hundreds of sources. Users can search for sports news based on city or state. Home Court provides image and description summaries with links and credits to the original articles. I engineered this app with a custom async query through News API and implemented the data through React.js. Technologies used include React.js and News API.

The core feature of this application is highlighted in the code below.

```
async getNews() {
  console.log(`${process.env.REACT_APP_NEWS_API_KEY}`);
  let url =
    "https://newsapi.org/v2/everything?" +
    `q=(NHL OR NFL OR NBA OR MLB) AND ${this.state.input}&` +
    "language=en&" +
    "from=2018-09-29&" +
    "sortBy=popularity&" +
    `apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
  let result = await fetch(url).then(response => response.json());
  // console.log(result);
  return result.articles;
}
```

In this code I am accomplishing two important tasks.

1.  I assign the function within the Main class, as an "async" function, which allows me to utilize the "await" keyword on the async fetch call. This forces the function to act in a synchronous manner, completing both the fetch and the promise functions, before moving on to the next iteration of the function.

This is important, because without this "async" and "await" assignments, getNews() would run asynchronously and wouldn't, the response.json() promise, wouldn't be rendered until the rest of the page is loaded. This would result in an error as the rest of the function rely on the response.json() data. Traditionally, this async issue could be solved by separating out this getNews() function in a separate file or component and importing the function into this Main file. We can slim down our application size by reducing this unecessary additional file, by utilizing the "async" and "await" keywords.

2.  The url query is based of the template query for News API. While the majority of the parameters are simple, language, from, or sortBy. The "q" parameter which is defined as "Advanced Search" is the most complex and can do the most work to narrow down your feed from News API's over 30,000 news articles.

In the "q" parameter I utilized SQL-like search queries and string interpolated an optional input from the React.js local state. I found this one line particularly interesting because we're combining JS, SQL(sorta), and React.js state in one line for an API database query. Overall this specific query is how we can narrow down our feed to specifically sports related news and incorporate a search ability for the user to also manipulate the query.
