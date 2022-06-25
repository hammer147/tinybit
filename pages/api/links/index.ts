import type { NextApiRequest, NextApiResponse } from 'next'
import { redis } from '../../../lib/redis'

type Data = { message: string } | { links: Record<string, unknown> }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  // validate req.method
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: `Method ${req.method} not allowed` })
  }

  // get links from Redis
  let links: Record<string, unknown>
  try {
    links = await redis.hgetall('links') || {}
  } catch (error) {
    return res.status(500)
  }
  // note that when links is null we send an empty object instead of a 404 response
  res.status(200).json({ links })
}
