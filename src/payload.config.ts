import { postgresAdapter } from '@payloadcms/db-postgres'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { nbTranslations as ecommerceNb } from '@payloadcms/plugin-ecommerce/translations/languages/nb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { nb } from '@payloadcms/translations/languages/nb'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import {
  adminOnlyFieldAccess,
  adminOrPublishedStatus,
  isAdmin,
  isAuthenticated,
  isCustomer,
  isDocumentOwner,
} from './access'
import { Authors } from './collections/Authors'
import { Brands } from './collections/Brands'
import { cartsCollectionOverride } from './collections/carts'
import { Categories } from './collections/Categories'
import { Faqs } from './collections/Faqs'
import { Guides } from './collections/Guides'
import { Media } from './collections/Media'
import { ordersCollectionOverride } from './collections/orders'
import { productsCollectionOverride, variantsCollectionOverride } from './collections/products'
import { Reviews } from './collections/Reviews'
import { Users } from './collections/Users'
import { demoResetEndpoint } from './endpoints/demoReset'
import { HomePage } from './globals/HomePage'
import { StoreSettings } from './globals/StoreSettings'
import { NOK } from './lib/currency'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * The site's own address. Payload only accepts login cookies from these origins, so another site can't
 * act as a logged-in admin. Vercel provides its URLs; SERVER_URL overrides (e.g. a custom domain).
 */
const vercelURL = (host: string | undefined) => (host ? `https://${host}` : undefined)
const serverURL = process.env.SERVER_URL || vercelURL(process.env.VERCEL_PROJECT_PRODUCTION_URL)
const trustedOrigins = [
  serverURL,
  vercelURL(process.env.VERCEL_URL), // preview deployments
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000',
].filter((origin): origin is string => Boolean(origin))

export default buildConfig({
  serverURL,
  csrf: trustedOrigins,
  cors: trustedOrigins,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Hylla admin',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Brands, Reviews, Guides, Authors, Faqs],
  globals: [HomePage, StoreSettings],
  endpoints: [demoResetEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  i18n: {
    fallbackLanguage: 'nb',
    supportedLanguages: { nb, en },
    translations: {
      nb: ecommerceNb,
    },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    ecommercePlugin({
      access: {
        adminOnlyFieldAccess,
        adminOrPublishedStatus,
        isAdmin,
        isAuthenticated,
        isCustomer,
        isDocumentOwner,
      },
      customers: { slug: 'users' },
      currencies: {
        supportedCurrencies: [NOK],
        defaultCurrency: 'NOK',
      },
      addresses: false,
      // Guest carts are identified by an ID and a secret kept in the visitor's browser; they hold no personal data.
      carts: {
        allowGuestCarts: true,
        cartsCollectionOverride,
      },
      // Hylla takes no payments, but the plugin's types reference this collection, so it stays and is hidden.
      transactions: {
        transactionsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          admin: { ...defaultCollection.admin, hidden: true },
        }),
      },
      payments: { paymentMethods: [] },
      products: {
        productsCollectionOverride,
        variants: {
          variantsCollectionOverride,
        },
      },
      orders: {
        ordersCollectionOverride,
      },
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Add the plugin's media fields even locally (no token), so migrations match production.
      alwaysInsertFields: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
