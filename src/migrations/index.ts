import * as migration_20261027_210209_initial from './20261027_210209_initial';
import * as migration_20261027_222134_header_menu_group from './20261027_222134_header_menu_group';
import * as migration_20261028_003535_product_rating_breakdown from './20261028_003535_product_rating_breakdown';
import * as migration_20261028_011719_home_page from './20261028_011719_home_page';
import * as migration_20261028_012826_faqs from './20261028_012826_faqs';
import * as migration_20261028_013403_faq_follow_ups from './20261028_013403_faq_follow_ups';
import * as migration_20261028_111103_min_side_account from './20261028_111103_min_side_account';
import * as migration_20261028_160209_order_placed_via_no_default from './20261028_160209_order_placed_via_no_default';

export const migrations = [
  {
    up: migration_20261027_210209_initial.up,
    down: migration_20261027_210209_initial.down,
    name: '20261027_210209_initial',
  },
  {
    up: migration_20261027_222134_header_menu_group.up,
    down: migration_20261027_222134_header_menu_group.down,
    name: '20261027_222134_header_menu_group',
  },
  {
    up: migration_20261028_003535_product_rating_breakdown.up,
    down: migration_20261028_003535_product_rating_breakdown.down,
    name: '20261028_003535_product_rating_breakdown',
  },
  {
    up: migration_20261028_011719_home_page.up,
    down: migration_20261028_011719_home_page.down,
    name: '20261028_011719_home_page',
  },
  {
    up: migration_20261028_012826_faqs.up,
    down: migration_20261028_012826_faqs.down,
    name: '20261028_012826_faqs',
  },
  {
    up: migration_20261028_013403_faq_follow_ups.up,
    down: migration_20261028_013403_faq_follow_ups.down,
    name: '20261028_013403_faq_follow_ups',
  },
  {
    up: migration_20261028_111103_min_side_account.up,
    down: migration_20261028_111103_min_side_account.down,
    name: '20261028_111103_min_side_account',
  },
  {
    up: migration_20261028_160209_order_placed_via_no_default.up,
    down: migration_20261028_160209_order_placed_via_no_default.down,
    name: '20261028_160209_order_placed_via_no_default'
  },
];
