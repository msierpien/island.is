import {
  AlertBanner,
  Article,
  ArticleCategory,
  ArticleGroup,
  ArticleSubgroup,
  Featured,
  Frontpage,
  FrontpageSlider,
  GenericPage,
  GroupedMenu,
  Html,
  Image,
  LifeEventPage,
  Link,
  Menu,
  MenuLinkWithChildren,
  News,
  ReferenceLink,
  SectionWithImage,
  Slice,
  SubArticle,
} from '../../types'
import { wysiwyg } from './richtext'
import {
  factory,
  slugify,
  simpleFactory,
  faker,
  title,
} from '@island.is/shared/mocking'
import { SystemMetadata } from '@island.is/shared/types'

export const referenceLink = factory<ReferenceLink>({
  slug: () => faker.lorem.slug(),
  type: () => 'article',
})

export const image = factory<SystemMetadata<Image>>({
  typename: 'Image',
  width: 500,
  height: 500,
  id: () => faker.datatype.uuid(),
  url: () => faker.image.abstract(500, 500),
  contentType: 'img/jpeg',
  title: () => title(),
})

export const html = factory<Html>({
  typename: 'Html',
  id: () => faker.datatype.uuid(),
  document: () => wysiwyg(),
})

export const sectionWithImage = factory<SystemMetadata<SectionWithImage>>({
  typename: 'SectionWithImage',
  id: () => faker.datatype.uuid(),
  title: () => title(),
  html: () => html(),
  image: () => image(),
})

export const slice = simpleFactory(
  (): Slice => {
    const factory = faker.random.arrayElement([html, sectionWithImage])
    return factory()
  },
)

export const subArticle = factory<SubArticle>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  slug: slugify('title'),
  body: () => [slice()],
})

export const articleCategory = factory<ArticleCategory>({
  title: () => title(),
  slug: slugify('title'),
  id: () => faker.datatype.uuid(),
  description: () => faker.lorem.sentence(),
})

export const article = factory<SystemMetadata<Article>>({
  typename: 'Article',
  id: () => faker.datatype.uuid(),
  title: () => title(),
  body: () => slice.list(3),
  slug: slugify('title'),
  intro: () => faker.lorem.paragraph(),
  category: null,
  subArticles: () =>
    faker.datatype.number(4) === 0
      ? subArticle.list(faker.datatype.number({ min: 1, max: 4 }))
      : [],
  relatedArticles: () => [],
  group: null,
  subgroup: null,
})

export const lifeEvent = factory<LifeEventPage>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  slug: slugify('title'),
  intro: () => faker.lorem.paragraph(),
  content: () => slice.list(6),
  image: () => image(),
  thumbnail: () => image(),
})

export const link = factory<Link>({
  text: () => faker.lorem.words(),
  url: () => faker.internet.url(),
})

export const menuLink = factory<MenuLinkWithChildren>({
  title: () => title(),
  link: () => referenceLink(),
  childLinks: () => [],
})

export const menu = factory<Menu>({
  id: faker.datatype.uuid(),
  title: () => title(),
  links: () => link.list(4),
  menuLinks: () => menuLink.list(4),
})

export const groupedMenu = factory<GroupedMenu>({
  id: faker.datatype.uuid(),
  title: () => title(),
  menus: () => menu.list(5),
})

export const alertBannerVariant = () =>
  faker.random.arrayElement(['error', 'info', 'success', 'warning', 'default'])

export const alertBanner = factory<AlertBanner>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  description: () => faker.lorem.sentence(),
  isDismissable: () => faker.datatype.boolean(),
  dismissedForDays: 7,
  link: () => referenceLink(),
  bannerVariant: () => alertBannerVariant(),
  showAlertBanner: () => faker.datatype.boolean(),
})

export const articleSubgroup = factory<ArticleSubgroup>({
  title: () => title(),
  slug: slugify('title'),
  importance: () => faker.datatype.number(),
})

export const articleGroup = factory<ArticleGroup>({
  title: () => title(),
  slug: slugify('title'),
  description: () => faker.lorem.sentence(),
})

export const news = factory<News>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  slug: slugify('title'),
  date: () => faker.date.past().toISOString(),
  intro: () => faker.lorem.paragraph(),
  subtitle: () => faker.lorem.sentence(),
  image: () => image(),
  content: () => slice.list(3),
  genericTags: () => [],
})

export const frontPageSlider = factory<FrontpageSlider>({
  title: () => title(),
  subtitle: () => faker.lorem.sentence(),
  link: null,
  content: () => faker.lorem.paragraph(),
})

export const featured = factory<Featured>({
  thing: () => referenceLink(),
  title: ({ thing }) => title(),
  attention: () => faker.datatype.boolean(),
})

export const genericPage = factory<GenericPage>({
  slug: slugify('title'),
  title: () => title(),
})

export const frontpage = factory<Frontpage>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  featured: () => featured.list(3),
  slides: () => frontPageSlider.list(2),
  lifeEvents: () => lifeEvent.list(6),
})
