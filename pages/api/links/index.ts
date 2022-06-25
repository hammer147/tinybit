import type { NextApiRequest, NextApiResponse } from 'next'
import { redis } from '../../../lib/redis'
import { generateRandomString } from '../../../utils/random'
import { isValidUrl } from '../../../utils/validation'

type Data = { message: string } | { links: Record<string, unknown> }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'GET':
      // get all the links from Redis
      let links: Record<string, unknown>
      try {
        links = await redis.hgetall('links') || {}
      } catch (error) {
        return res.status(500).json({ message: 'Getting links failed.' })
      }
      // note that when links is null we send an empty object instead of a 404 response
      res.status(200).json({ links })
      break

    case 'POST':
      // validate req.body
      const { longUrl } = req.body
      if (!(longUrl && isValidUrl(longUrl))) {
        return res.status(422).json({ message: 'Invalid input.' })
      }
      // generate short url
      const shortUrl = generateRandomString(4)
      // save to Redis
      let result: number
      try {
        result = await redis.hset('links', { [shortUrl]: longUrl })
      } catch (error) {
        return res.status(500).json({ message: 'Inserting link failed.' })
      }
      if (result === 1) {
        return res.status(201).json({ message: 'Successfully added link.' })
      }
      res.status(404)
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end({ message: `Method ${req.method} not allowed.` })
  }
}
