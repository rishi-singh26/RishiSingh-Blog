import { NextFunction, Request, Response } from "express";

const dummyHTML = `
<h1 id="this-is-the-header">This is the header</h1>
<h2 id="this-is-the-h2">This is the h2</h2>
<h3 id="this-is-the-h3">This is the h3</h3>
<table>
<thead>
<tr>
<th>Header</th>
<th>Header</th>
</tr>
</thead>
<tbody>
<tr>
<td>This is the table</td>
<td>This is another cell</td>
</tr>
<tr>
<td>This the second row</td>
<td>This is also the second row</td>
</tr>
</tbody>
</table>
<pre><code class="lang-javascript">let <span class="hljs-built_in">name</span> = <span class="hljs-string">"Jane Doe"</span>
console.<span class="hljs-built_in">log</span>(<span class="hljs-built_in">name</span>);
</code></pre>
<p>This is in <code>code</code></p>
<p><img src="https://placebear.com/300/300" alt="alt text"></p>
<p><a href="https://markdowntohtml.com">reference link</a></p>
<hr>
<p><a href="https://markdowntohtml.com">use numbers</a>.</p>
`;

export const getBlogById = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.render("blog", {
        title: "Blog Title",
        path: "/blog",
        content: dummyHTML,
        // currentPage: page,
        // hasNextPage: page < totalPages,
        // hasPrevPage: page > 1,
        // nextPage: page + 1,
        // prevPage: page - 1,
        // lastPage: totalPages,
        pageDescription: "Experienced software developer in the vibrant tech landscape of southern India, building innovative solutions with precision and passion. Explore my portfolio of impactful projects.",
        canonicalUrl: "https://rishisingh.in/",
        thumbnailUrl: "/images/BlogWebOGPoster.png",
    });
};
