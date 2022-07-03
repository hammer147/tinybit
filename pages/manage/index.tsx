import type { NextPage } from 'next'
import Head from 'next/head'
import { FormEventHandler, useEffect, useState } from 'react'
import { FaCopy, FaTrash, FaTrashAlt } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import styles from '../../styles/Home.module.css'

const Manage: NextPage = () => {
  const [longUrl, setLongUrl] = useState('')
  const [links, setLinks] = useState<Record<string, unknown>>({})

  const addLink: FormEventHandler = async e => {
    e.preventDefault()

    // basic client-side validation via type="url" in input element
    // more validation is done server-side

    // console.log(`Make this short: ${longUrl}`)

    const response = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ longUrl })
    })

    if (!response.ok) return toast.error('Something Went Wrong')

    // const result = await response.json()
    // console.log(result)

    setLongUrl('')
    setLinks(await getLinks())

    toast.success('Successfully shortened link.')
  }

  const deleteLink = async (shortUrl: string) => {
    const response = await fetch(`/api/link/${shortUrl}`, {
      method: 'DELETE'
    })

    if (!response.ok) return toast.error('Something Went Wrong')

    // const result = await response.json()
    // console.log(result)

    setLinks(await getLinks())

    toast.success('Successfully removed link.')
  }

  const getLinks = async () => {
    const response = await fetch('/api/links')
    if (!response.ok) {
      toast.error('Something Went Wrong')
      return {}
    }
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
        toast.success('Copied short link to the clipboard.')
      },
      () => {
        toast.error('Could not copy short link to the clipboard.')
      }
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>URL Shortener</title>
        <meta name="description" content="Shortens urls" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>TinyBit</h1>
        <h2>Url Shortener</h2>
        <div>
          <form onSubmit={addLink}>
            <input
              type="url"
              required
              placeholder="https://"
              value={longUrl}
              onChange={e => setLongUrl(e.target.value)}
              style={{ width: `${Math.max(40, longUrl.length * 0.5)}em` }}
            />
            <button className={styles.shortenButton}>Shorten</button>
          </form>
        </div>
        {/* <pre>{JSON.stringify(links, null, 2)}</pre> */}
        <table className={styles.table}>
          {/* <thead>
            <tr>
              <td>Delete</td>
              <td>Short url</td>
              <td>Copy</td>
              <td>Long url</td>
            </tr>
          </thead> */}
          <tbody>
            {Object.keys(links).map(short => {
              const long = links[short] as string
              return (
                <tr key={short}>
                  <td><button className={`${styles.iconButton} ${styles.trash}`} onClick={() => deleteLink(short)}><FaTrashAlt /></button></td>
                  <td>{`${process.env.NEXT_PUBLIC_DOMAIN}/${short}`}</td>
                  <td><button className={`${styles.iconButton} ${styles.copy}`} onClick={() => copyToClipboard(short)}><FaCopy /></button></td>
                  <td>{long}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </main>
      <ToastContainer
        position="top-center"
        autoClose={2000}
      />
    </div>
  )
}

export default Manage
