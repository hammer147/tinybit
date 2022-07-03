import { NextRequest, NextResponse } from 'next/server'
import { redis } from './lib/redis'

export const config = {
  matcher: ['/:path*',],
}

export async function middleware(req: NextRequest) {
  // console.log('pathname: ', req.nextUrl.pathname)

  // if pathname starts with '/manage' or '/api/link' then authorization is required 
  if (req.nextUrl.pathname.startsWith('/manage') ||
    req.nextUrl.pathname.startsWith('/api/link')) {

    const basicAuth = req.headers.get('authorization')
    const url = req.nextUrl

    if (!basicAuth) {
      url.pathname = '/api/auth'
      return NextResponse.rewrite(url)
    }

    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')
    if (!(user === process.env.USER && pwd === process.env.PWD)) {
      url.pathname = '/api/auth'
      return NextResponse.rewrite(url)
    }
  }

  // if pathname is '/' followed by exactly 4 alphanumeric chars
  // check short url in redis and redirect
  const regex = new RegExp('^\/[a-zA-Z0-9]{4}$')
  if (regex.test(req.nextUrl.pathname)) {
    const shortUrl = req.nextUrl.pathname.split('/').slice(-1)[0]
    let longUrl
    try {
      longUrl = await redis.hget('links', shortUrl)
    } catch (error) {
      return NextResponse.redirect(req.nextUrl.origin) // server error
    }
    if (longUrl) return NextResponse.redirect(longUrl as string)
    return NextResponse.redirect(req.nextUrl.origin) // short url not found in redis
  }

  return NextResponse.next()
}
