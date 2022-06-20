/**
 * Validates a given url
 * @param url the url to validate
 */
export const isValidUrl = (url: string) => {
  let urlPattern = "(https?|ftp)://(www\\.)?(((([a-zA-Z0-9.-]+\\.){1,}[a-zA-Z]{2,4}|localhost))|((\\d{1,3}\\.){3}(\\d{1,3})))(:(\\d+))?(/([a-zA-Z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?(\\?([a-zA-Z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)?(#([a-zA-Z0-9._-]|%[0-9A-F]{2})*)?"
  urlPattern = "^" + urlPattern + "$"
  const regex = new RegExp(urlPattern)
  return regex.test(url)
}
