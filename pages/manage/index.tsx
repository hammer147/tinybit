import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { FormEventHandler, useEffect, useState } from 'react'
import styles from '../../styles/Home.module.css'

const Manage: NextPage = () => {
  const [longUrl, setLongUrl] = useState('')
  const [links, setLinks] = useState<Record<string, unknown>>({})

  const addLink: FormEventHandler = async e => {
    e.preventDefault()

    // basic client-side validation via type="url" in input element
    // more validation is done server-side

    // console.log(`Make this short: ${longUrl}`)

    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ longUrl })
    })

    // if (!response.ok) return toast.error('Something Went Wrong')

    const result = await response.json()

    // console.log(result)

    setLongUrl('')
    setLinks(await getLinks())

  }

  const deleteLink = async (shortUrl: string) => {
    const response = await fetch(`/api/delete/${shortUrl}`, {
      method: 'DELETE'
    })

    // if (!response.ok) return toast.error('Something Went Wrong')

    const result = await response.json()

    // console.log(result)

    setLinks(await getLinks())
  }

  const getLinks = async () => {
    const response = await fetch('/api/links')
    // todo check response.ok
    const data = await response.json()
    return data.links
  }

  useEffect(() => {
    (async () => setLinks(await getLinks()))()
  }, [])

  const copyToClipboard = (shortUrl: string) => {
    const url = `${process.env.NEXT_PUBLIC_DOMAIN}/${shortUrl}`
    navigator.clipboard.writeText(url).then(
      () => {
        console.log('copied link to clipboard')
      },
      () => {
        console.log('could not copy link to clipboard')
      }
    )
  }

  // todo styles 

  return (
    <div className={styles.container}>
      <Head>
        <title>URL Shortener</title>
        <meta name="description" content="Shortens urls" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>TinyBit</h1>
        <div>
          <h2>Create a short url</h2>
          <form onSubmit={addLink}>
            <input
              type="url"
              required
              placeholder="enter long url"
              value={longUrl}
              onChange={e => setLongUrl(e.target.value)}
            />
            <button>Make it short</button>
          </form>
        </div>
        {/* <pre>{JSON.stringify(links, null, 2)}</pre> */}
        <table>
          <thead>
            <tr>
              <td>Delete</td>
              <td>Short url</td>
              <td>Long url</td>
            </tr>
          </thead>
          <tbody>
            {Object.keys(links).map(short => {
              const long = links[short] as string
              return (
                <tr key={short}>
                  <td><button onClick={() => deleteLink(short)}>del</button></td>
                  <td onClick={()=> copyToClipboard(short)}>{`${process.env.NEXT_PUBLIC_DOMAIN}/${short}`}</td>
                  <td>{long}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Manage
