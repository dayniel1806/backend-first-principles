# Chapter 2: Routing

## What I built
A router from scratch in plain Node, with no framework. `router.js` stores routes and matches requests. `server.js` registers routes and starts the server.

## How it works
- `router.get/post/put/delete` all call one internal `register(method, path, handler)`, which pushes `{ method, path, handler }` into a private `routes` array. Handlers are stored at startup and only run when a request matches.
- `handle(req, res)` runs on every request: parse the URL, normalize the path, set CORS headers, answer `OPTIONS`, then loop through the routes.
- `match(routePath, pathname)` splits both paths on `/`. If the lengths differ it returns `null`. Otherwise it compares segment by segment: a `:name` segment is saved into `params`, and any other segment must match exactly.
- `req.params` and `req.query` aren't built into Node. I attach them to `req` myself in `handle` so handlers can read them.

## Params vs query
- **Params** come from the path (`/users/42` gives `{ id: "42" }`). They're defined by the route pattern, and without them the route doesn't match.
- **Query** comes after the `?` (`?role=admin` gives `{ role: "admin" }`). It's optional and the client decides it.
- `new URL(req.url, "http://localhost")` gives me both `pathname` and `searchParams`. `Object.fromEntries(url.searchParams)` turns `searchParams` into a plain object. All values are strings.

## 404 vs 405
- **404** means the path doesn't exist at all.
- **405** means the path exists but not for that method. It must include an `Allow` header listing the valid methods.
- To tell them apart I check the **path first, then the method**. If the path matches but the method doesn't, I remember that method in `allowed` and keep looking. After the loop, if `allowed` has entries I send 405, otherwise 404.

## CORS and preflight
- CORS headers are set once at the top of `handle`, so every response (200, 404, 405) carries them.
- `OPTIONS` requests are answered with `204` before the route loop, because the browser is only asking permission and no route should run.
- A `405` on DELETE doesn't mean CORS failed. The preflight succeeded and the route just doesn't exist.

## Edge cases
- **Trailing slash:** `/users/42/` splits into an extra empty segment and fails the length check. I strip the last `/` in `handle` before matching, but only if `pathname.length > 1`, otherwise the root `/` would become an empty string.
- **Truthy `{}`:** `match` returns `{}` for static routes. An empty object is truthy in JavaScript, so `if (!params)` only skips real `null` results. That's why `GET /` still works.

## Bugs I hit and what they taught me
- **`ERR_HTTP_HEADERS_SENT`:** a missing `return` after the handler, and the 404 inside the loop, made the code send two responses. The 404 must go *after* the loop, and the handler call needs `return`.
- **`Object.fromEntries(url,searchParams)`:** a comma instead of a dot broke `req.query`. Read suspicious lines character by character.
- **Header typos** (`Cotrol`, `Alllow`) fail silently, because the browser just never sees the header it wants.
- **curl:** always put URLs with `?` or `&` in quotes. Use `-i` (GET plus headers), not `-I` (HEAD). Restart the server after every edit, because Node doesn't reload files.

## What's missing (next chapters)
- Reading request bodies (ch03)
- Auth (ch04)
- Sharing logic like CORS across routes without repeating it, i.e. middleware (ch06)