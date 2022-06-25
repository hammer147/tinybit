import type { NextApiRequest, NextApiResponse } from 'next'
import { redis } from '../../../lib/redis'
import { generateRandomString } from '../../../utils/random'
import { isValidUrl } from '../../../utils/validation'

type Data = { message: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  // validate req.method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: `Method ${req.method} not allowed` })
  }

  // validate req.body
  const { longUrl } = req.body
  if (!(longUrl && isValidUrl(longUrl))) {
    return res.status(422).json({ message: 'Invalid Input.' })
  }

  // generate short url
  const shortUrl = generateRandomString(4)

  // save to Redis
  let result: number
  try {
    result = await redis.hset('links', { [shortUrl]: longUrl })
  } catch (error) {
    return res.status(500)
  }

  if (result === 1) {
    return res.status(201).json({ message: 'successfully saved' })
  } else {
    return res.status(404)
  }

}
