import { base, en, Faker, nb_NO } from '@faker-js/faker'

export type DemoCustomer = {
  seed: number
  firstName: string
  lastName: string
  email: string
  /** Eight digits without the country code, e.g. "91234567". */
  phone: string
  address: { addressLine: string; postalCode: string; city: string; country: string }
}

const asciiName = (value: string) =>
  value
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFKD')
    .replace(/[^a-z]/g, '')

/** A random seed for {@link demoCustomer}. */
export const randomDemoSeed = () => Math.floor(Math.random() * 2 ** 31)

/**
 * A fictional Norwegian customer. The same seed always gives the same person, so the checkout
 * only sends the seed back and the server rebuilds the customer: nothing typed by a visitor is stored.
 */
export function demoCustomer(seed: number): DemoCustomer {
  const faker = new Faker({ locale: [nb_NO, en, base], seed })
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    seed,
    firstName,
    lastName,
    email: `${asciiName(firstName)}.${asciiName(lastName)}@eksempel.no`,
    phone: `9${faker.string.numeric({ length: 7, allowLeadingZeros: true })}`,
    address: {
      addressLine: faker.location.streetAddress(),
      postalCode: faker.location.zipCode('####'),
      city: faker.location.city(),
      country: 'Norge',
    },
  }
}
