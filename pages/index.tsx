import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>TinyBit</title>
        <meta name="description" content="url shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>TinyBit</h1>
        <h2>Url Shortener</h2>
        <Link href="/manage">
          <a>Enter</a>
        </Link>
      </main>

    </div>
  )
}

export default Home
