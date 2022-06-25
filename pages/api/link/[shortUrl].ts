import type { NextApiRequest, NextApiResponse } from 'next'
import { redis } from '../../../lib/redis'

type Data = { message: string } | { links: Record<string, unknown> }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  const { shortUrl } = req.query

  switch (req.method) {
    case 'DELETE':
      let result: number
      try {
        result = await redis.hdel('links', shortUrl as string)
      } catch (error) {
        return res.status(500).json({ message: 'Removing link failed.' })
      }
      if (result === 0) {
        return res.status(404).json({ message: 'Could not find link to remove.' })
      }
      res.status(200).json({ message: 'successfully removed link.' })
      break

    default:
      res.setHeader('Allow', ['DELETE'])
      res.status(405).end({ message: `Method ${req.method} not allowed` })
  }
}
