import type { NextApiRequest, NextApiResponse } from 'next'
import { redis } from '../../../lib/redis'

type Data = { message: string } | { links: Record<string, unknown> }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  // validate req.method
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE'])
    return res.status(405).json({ message: `Method ${req.method} not allowed` })
  }

  // validate req.query
  const { shortUrl } = req.query
  console.log('query: ', shortUrl)
  if (!(shortUrl)) {
    return res.status(422).json({ message: 'Invalid Input.' })
  }

  // delete from Redis
  let result: number
  try {
    result = await redis.hdel('links', shortUrl as string)
  } catch (error) {
    return res.status(500)
  }

  if (result === 0) {
    return res.status(404)
  } else {
    return res.status(200).json({ message: 'successfully removed' })
  }
}
