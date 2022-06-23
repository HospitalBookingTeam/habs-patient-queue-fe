import { useState, useEffect } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../theme'
import createEmotionCache from '../createEmotionCache'
import useAuth from '../hooks/useAuth'
import Login from './login'
import { RecoilRoot } from 'recoil'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Loading from '../components/Loading'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const memoize = (fn: any) => {
  let cache = {}
  return (...args: any) => {
    let n: keyof Object = args[0]
    if (n in cache) {
      return cache[n]
    } else {
      let result = fn(n)
      cache[n] = result
      return result
    }
  }
}

// ignore in-browser next/js recoil warnings until its fixed.
const mutedConsole = memoize((console: Console) => ({
  ...console,
  warn: (...args: any) =>
    args[0].includes('Duplicate atom key') ? null : console.warn(...args),
}))

global.console = mutedConsole(global.console)

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeError', (e) => setLoading(false))
    router.events.on('routeChangeStart', (e) => setLoading(true))
    router.events.on('routeChangeComplete', (e) => {
      setLoading(false)
    })

    return () => {
      router.events.off('routeChangeError', (e) => setLoading(false))
      router.events.off('routeChangeStart', (e) => setLoading(true))
      router.events.off('routeChangeComplete', (e) => setLoading(false))
    }
  }, [router.events])

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 0)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {loading && <Loading />}
          <Component {...pageProps} />
        </ThemeProvider>
      </RecoilRoot>
    </>
  )
}
