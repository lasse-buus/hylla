import assert from 'node:assert/strict'

import { toImage } from '@/lib/media'

// Payload builds absolute URLs once serverURL is set; the image optimizer only allows our relative file path.
const media = {
  alt: 'Kaffe',
  width: 1200,
  height: 800,
  url: 'https://hylla.vercel.app/api/media/file/lifestyle-kaffe.jpg',
  sizes: { card: { url: 'https://hylla.vercel.app/api/media/file/lifestyle-kaffe-640x427.jpg?v=2', width: 640, height: 427 } },
}
assert.equal(toImage(media)?.url, '/api/media/file/lifestyle-kaffe-640x427.jpg?v=2', 'own file URL becomes relative')
assert.equal(toImage({ ...media, sizes: {} })?.url, '/api/media/file/lifestyle-kaffe.jpg', 'original upload too')
assert.equal(toImage({ ...media, sizes: {}, url: '/api/media/file/a.jpg' })?.url, '/api/media/file/a.jpg', 'relative stays relative')

// Anything else (e.g. a direct Blob URL) is left alone.
const blob = 'https://abc.public.blob.vercel-storage.com/a.jpg'
assert.equal(toImage({ ...media, sizes: {}, url: blob })?.url, blob)
