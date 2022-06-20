import type { NextApiRequest, NextApiResponse } from 'next'
import { redis } from '../../../lib/redis'

type Data = { message: string } | { links: Record<string, unknown> }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // TODO protection


  // validate req.method
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: `Method ${req.method} not allowed` })
  }

  // get links from Redis
  const links = await redis.hgetall('links') || {}
  
  // todo check result before sending response and use try catch
  // console.log({ links })

  res.status(200).json({ links })
}
