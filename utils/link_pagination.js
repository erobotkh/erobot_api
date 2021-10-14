const getUrl = (req) => {
  const protocol = req.protocol;
  const host = req.hostname;
  const path = req.originalUrl.match('^[^?]*')[0].split('/').slice(1).join('/');
  const port = process.env.PORT || PORT;

  const fullUrl = `${protocol}://${host}:${port}/${path}`
  return fullUrl;
}

const _getUrlFromPage = (page, req) => {
  const _url = getUrl(req);
  const query = req.query;

  query['page'] = page;

  const qs = new URLSearchParams(req.query);
  return page != null ? _url + '?' + qs : null
}

const getTopLevelLinks = (docs, req) => {
  return {
    self: _getUrlFromPage(docs.page, req),
    next: _getUrlFromPage(docs.nextPage, req),
    prev: _getUrlFromPage(docs.prevPage, req),
    last: _getUrlFromPage(docs.totalDocs, req),
  }
}

const getMeta = (docs, req) => {
  return  {
    count: docs.limit,
    total_count: docs.totalDocs,
    total_pages: docs.totalPages,
    current_page: docs.page,
  }
}

export { getUrl, getTopLevelLinks, getMeta }