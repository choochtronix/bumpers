# Brrtz MCP Connector

Brrtz exposes a public, read-only Model Context Protocol endpoint:

- Local: `http://127.0.0.1:5173/mcp`
- Production after deployment: `https://brrtz.com/mcp`

The first connector phase intentionally excludes private account data and write actions.

## Live Beta Tools

### `search_gear`

Searches current Brrtz marketplace and shop sources. Inputs include terms, region, category,
source selection, maximum price, exclude terms, and a result limit capped at 50.

Results use the normalized Brrtz listing contract and include original listing URLs. Brrtz is
a discovery layer and is not the seller or merchant of record.

### `get_regions`

Returns supported region IDs, labels, currencies, beta status, and source coverage.

### `get_sources`

Returns public source metadata, optionally filtered by region.

## Local Verification

Start Brrtz:

```sh
cd /home/hanzj/code/brrtz
npm start
```

Run the automated MCP protocol tests:

```sh
npm test
```

For interactive inspection:

```sh
npx @modelcontextprotocol/inspector@latest
```

Select **Streamable HTTP** and enter:

```text
http://127.0.0.1:5173/mcp
```

Verify initialization, list all three tools, and call each tool with representative inputs.

## Safety Boundaries

- All current tools are annotated read-only and non-destructive.
- Marketplace search is marked as an external read operation; catalog tools are closed-world reads.
- Tool inputs are schema validated and bounded.
- Search results are capped to prevent bulk database-style export.
- The public endpoint applies a per-client request limit.
- Search results return original source URLs.
- No Supabase user token, saved search, watchlist, or profile data is exposed.

## Next Phase: Account Connection

The next phase requires OAuth 2.1 authorization between the MCP client and Brrtz. After that
layer is reviewed, Brrtz can add user-authorized tools such as:

- `list_saved_searches`
- `run_saved_search`
- `get_new_matches`
- `list_watchlist`

Write tools such as `save_search` and `watch_listing` should follow later and require explicit
confirmation.
