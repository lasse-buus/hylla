import type { CollectionSlug, Payload, Where } from 'payload'

import fs from 'fs'
import path from 'path'

import { defaultDeliveryMethods } from '@/globals/StoreSettings'

import { brands, categories, descriptionFor, images, products, ratingBreakdownFor, reviews, variantTypes } from './data/catalog'
import { authors, guides } from './data/guides'
import { homeLayout } from './data/home'
import { faqs } from './data/faqs'
import { seedDemoAccount } from './demoAccount'
import { buildDemoOrders, type CatalogEntry } from './demoOrders'

type ID = number | string
type Doc = { id: ID } & Record<string, unknown>

const IMAGE_DIR = path.resolve(process.cwd(), 'src/seed/images')
const DAY = 24 * 60 * 60 * 1000

/**
 * Brings the demo store back to a tidy, known state:
 * catalog, guides and settings are upserted from the seed files (stable IDs, media is reused),
 * anything not in the seed is removed, and orders/carts are replaced with fresh fictional ones.
 */
export async function resetDemo(payload: Payload) {
  const log = (msg: string) => payload.logger.info(`[demo-reset] ${msg}`)
  const started = Date.now()

  // Transactional data goes first so nothing points at catalog rows we remove.
  await deleteAll(payload, 'orders')
  await deleteAll(payload, 'carts')
  await deleteAll(payload, 'reviews')
  log('Slettet ordrer, handlekurver og vurderinger')

  await ensureAdmin(payload)

  const mediaIDs = await upsertMedia(payload)
  const media = (file: string) => mustGet(mediaIDs, file, 'bilde')
  log(`Bilder klare (${Object.keys(mediaIDs).length})`)

  const brandIDs: Record<string, ID> = {}
  for (const brand of brands) {
    brandIDs[brand.slug] = (await upsert(payload, 'brands', { slug: { equals: brand.slug } }, brand)).id
  }
  await removeOthers(payload, 'brands', 'slug', Object.keys(brandIDs))

  const categoryIDs: Record<string, ID> = {}
  for (const category of [...categories].sort((a, b) => Number(Boolean(a.parent)) - Number(Boolean(b.parent)))) {
    const doc = await upsert(payload, 'categories', { slug: { equals: category.slug } }, {
      title: category.title,
      slug: category.slug,
      icon: category.icon,
      sortOrder: category.sortOrder,
      menuGroup: category.menuGroup ?? null,
      description: category.description,
      heroImage: category.heroImage ? media(category.heroImage) : null,
      parent: category.parent ? mustGet(categoryIDs, category.parent, 'kategori') : null,
      menuPromo: {},
    })
    categoryIDs[category.slug] = doc.id
  }
  await removeOthers(payload, 'categories', 'slug', Object.keys(categoryIDs))

  // Variant types and options
  const optionIDs: Record<string, ID> = {}
  const variantTypeIDs: Record<string, ID> = {}
  for (const type of variantTypes) {
    const typeDoc = await upsert(payload, 'variantTypes', { name: { equals: type.name } }, { name: type.name, label: type.label })
    variantTypeIDs[type.name] = typeDoc.id
    for (const option of type.options) {
      const optionDoc = await upsert(
        payload,
        'variantOptions',
        { and: [{ value: { equals: option.value } }, { variantType: { equals: typeDoc.id } }] },
        { value: option.value, label: option.label, variantType: typeDoc.id },
      )
      optionIDs[`${type.name}:${option.value}`] = optionDoc.id
    }
  }

  // Products (first pass without `related`, which can point at products created later)
  const productIDs: Record<string, ID> = {}
  for (const product of products) {
    const doc = await upsert(payload, 'products', { slug: { equals: product.slug } }, {
      _status: 'published',
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      brand: mustGet(brandIDs, product.brand, 'merke'),
      categories: product.categories.map((slug) => mustGet(categoryIDs, slug, 'kategori')),
      shortSpecs: product.shortSpecs,
      priceInNOKEnabled: true,
      priceInNOK: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
      inventory: product.inventory,
      badge: product.badge ?? 'none',
      rating: product.rating,
      reviewCount: product.reviewCount,
      ratingBreakdown: ratingBreakdownFor(product),
      gallery: product.gallery.map(media),
      highlights: (product.highlights ?? []).map((value) => ({ text: value })),
      overviewTitle: product.overviewTitle ?? null,
      description: descriptionFor(product) ?? null,
      features: product.features ?? [],
      specGroups: (product.specGroups ?? []).map((group) => ({
        title: group.title,
        rows: group.rows.map(([label, value]) => ({ label, value })),
      })),
      faq: product.faq ?? [],
      enableVariants: Boolean(product.variants?.length),
      variantTypes: (product.variantTypes ?? []).map((name) => mustGet(variantTypeIDs, name, 'varianttype')),
      related: [],
    })
    productIDs[product.slug] = doc.id
  }

  const variantIDs: Record<string, ID> = {}
  for (const product of products) {
    for (const variant of product.variants ?? []) {
      const doc = await upsert(payload, 'variants', { sku: { equals: variant.sku } }, {
        _status: 'published',
        product: productIDs[product.slug],
        sku: variant.sku,
        options: variant.options.map((option) => mustGet(optionIDs, `${option.type}:${option.value}`, 'variantvalg')),
        priceInNOKEnabled: true,
        priceInNOK: variant.price,
        compareAtPrice: variant.compareAtPrice ?? null,
        inventory: variant.inventory,
      })
      variantIDs[variant.sku] = doc.id
    }
  }
  await removeOthers(payload, 'variants', 'sku', Object.keys(variantIDs))

  for (const product of products) {
    if (!product.related?.length) continue
    await payload.update({
      collection: 'products',
      id: productIDs[product.slug],
      data: { related: product.related.map((slug) => mustGet(productIDs, slug, 'produkt')) } as never,
      depth: 0,
    })
  }
  await removeOthers(payload, 'products', 'slug', Object.keys(productIDs))
  log(`Produkter klare (${products.length})`)

  const now = Date.now()
  for (const review of reviews) {
    await payload.create({
      collection: 'reviews',
      data: {
        product: mustGet(productIDs, review.product, 'produkt'),
        authorName: review.authorName,
        place: review.place,
        rating: review.rating,
        title: review.title,
        body: review.body,
        helpfulCount: review.helpfulCount,
        verifiedPurchase: true,
        publishedAt: new Date(now - review.daysAgo * DAY).toISOString(),
      } as never,
    })
  }

  // Authors and guides
  const authorIDs: Record<string, ID> = {}
  for (const author of authors) {
    authorIDs[author.slug] = (await upsert(payload, 'authors', { slug: { equals: author.slug } }, author)).id
  }
  await removeOthers(payload, 'authors', 'slug', Object.keys(authorIDs))

  const guideIDs: Record<string, ID> = {}
  for (const guide of guides) {
    const doc = await upsert(payload, 'guides', { slug: { equals: guide.slug } }, {
      _status: 'published',
      title: guide.title,
      slug: guide.slug,
      kicker: guide.kicker,
      excerpt: guide.excerpt,
      heroImage: media(guide.heroImage),
      heroCaption: guide.heroCaption ?? null,
      department: mustGet(categoryIDs, guide.department, 'kategori'),
      author: mustGet(authorIDs, guide.author, 'skribent'),
      readingMinutes: guide.readingMinutes,
      publishedAt: new Date(now - guide.daysAgo * DAY).toISOString(),
      relatedProducts: guide.relatedProducts.map((slug) => mustGet(productIDs, slug, 'produkt')),
      content: guide.content((slug) => mustGet(productIDs, slug, 'produkt')),
    })
    guideIDs[guide.slug] = doc.id
  }
  await removeOthers(payload, 'guides', 'slug', Object.keys(guideIDs))
  log(`Guider klare (${guides.length})`)

  // Mega menu promos now that products and guides exist
  for (const category of categories) {
    if (!category.menuPromo) continue
    await payload.update({
      collection: 'categories',
      id: categoryIDs[category.slug],
      data: {
        menuPromo: {
          eyebrow: category.menuPromo.eyebrow,
          product: mustGet(productIDs, category.menuPromo.product, 'produkt'),
          image: media(category.menuPromo.image),
          guide: category.menuPromo.guide ? mustGet(guideIDs, category.menuPromo.guide, 'guide') : null,
        },
      } as never,
      depth: 0,
    })
  }

  // Customer service questions, numbered in listed order within their topic or parent.
  // Top-level questions go first so follow-ups can point at them.
  const faqOrder: Record<string, number> = {}
  const faqIDs: Record<string, ID> = {}
  for (const faq of [...faqs].sort((a, b) => Number(Boolean(a.parent)) - Number(Boolean(b.parent)))) {
    const group = faq.parent ?? faq.topic
    faqOrder[group] = (faqOrder[group] ?? 0) + 10
    const doc = await upsert(payload, 'faqs', { question: { equals: faq.question } }, {
      question: faq.question,
      answer: faq.answer,
      topic: faq.topic ?? null,
      parent: faq.parent ? mustGet(faqIDs, faq.parent, 'spørsmål') : null,
      sortOrder: faqOrder[group],
    })
    faqIDs[faq.question] = doc.id
  }
  await removeOthers(payload, 'faqs', 'question', faqs.map((faq) => faq.question))

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      layout: homeLayout({
        category: (slug) => mustGet(categoryIDs, slug, 'kategori'),
        product: (slug) => mustGet(productIDs, slug, 'produkt'),
        media,
      }),
    } as never,
  })

  await payload.updateGlobal({
    slug: 'store-settings',
    data: { freeShippingThreshold: 1000, deliveryMethods: defaultDeliveryMethods } as never,
  })

  // Fictional orders
  const catalog: CatalogEntry[] = products.map((product) => ({
    productID: productIDs[product.slug],
    slug: product.slug,
    title: product.title,
    sku: product.sku,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    variants: product.variants?.map((variant) => ({
      variantID: variantIDs[variant.sku],
      sku: variant.sku,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      label: variant.options
        .map((option) => variantTypes.find((t) => t.name === option.type)?.options.find((o) => o.value === option.value)?.label)
        .filter(Boolean)
        .join(' · '),
    })),
  }))

  const demoOrders = buildDemoOrders(catalog).sort((a, b) => a.placedAt.localeCompare(b.placedAt))
  for (const order of demoOrders) {
    await payload.create({
      collection: 'orders',
      data: order as never,
      context: { isSeeding: true },
      depth: 0,
    })
  }
  log(`Ordrer opprettet (${demoOrders.length})`)

  const account = await seedDemoAccount(payload, catalog)
  log(`Demokunde klar (${account.orders} ordrer)`)

  return {
    durationMs: Date.now() - started,
    orders: demoOrders.length,
    accountOrders: account.orders,
    products: products.length,
    guides: guides.length,
  }
}

function mustGet(map: Record<string, ID>, key: string, kind: string): ID {
  const value = map[key]
  if (value === undefined) throw new Error(`Seed: fant ikke ${kind} «${key}»`)
  return value
}

async function upsert(payload: Payload, collection: CollectionSlug, where: Where, data: Record<string, unknown>): Promise<Doc> {
  const existing = await payload.find({ collection, where, limit: 1, depth: 0, pagination: false, trash: true })
  const found = existing.docs[0] as unknown as Doc | undefined

  if (found) {
    return (await payload.update({ collection, id: found.id, data: data as never, depth: 0 })) as unknown as Doc
  }

  return (await payload.create({ collection, data: data as never, depth: 0 })) as unknown as Doc
}

async function deleteAll(payload: Payload, collection: CollectionSlug) {
  await payload.delete({ collection, where: { id: { exists: true } }, depth: 0 })
}

async function removeOthers(payload: Payload, collection: CollectionSlug, field: string, keep: string[]) {
  await payload.delete({
    collection,
    where: { [field]: { not_in: keep } },
    depth: 0,
    trash: true,
  })
}

async function upsertMedia(payload: Payload): Promise<Record<string, ID>> {
  const ids: Record<string, ID> = {}

  for (const image of images) {
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: image.file } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs[0]) {
      ids[image.file] = existing.docs[0].id
      continue
    }

    const filePath = path.join(IMAGE_DIR, image.file)
    if (!fs.existsSync(filePath)) throw new Error(`Seed: mangler bildefil ${filePath}`)

    const created = await payload
      .create({ collection: 'media', data: { alt: image.alt }, filePath })
      .catch((error: unknown) => {
        throw new Error(`Seed: kunne ikke laste opp ${image.file}: ${error instanceof Error ? error.message : String(error)}`)
      })
    ids[image.file] = created.id
  }

  return ids
}

async function ensureAdmin(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) return

  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0 })
  if (existing.docs[0]) return

  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Hylla admin', roles: ['admin'] } as never,
  })
}
