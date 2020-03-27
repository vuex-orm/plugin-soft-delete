import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Morphed By Many', () => {
  class Post extends Model {
    static entity = 'posts'

    static fields() {
      return {
        id: this.attr(null)
      }
    }
  }

  class Video extends Model {
    static entity = 'videos'

    static fields() {
      return {
        id: this.attr(null)
      }
    }
  }

  class Tag extends Model {
    static entity = 'tags'

    static fields() {
      return {
        id: this.attr(null),
        posts: this.morphedByMany(
          Post,
          Taggable,
          'tag_id',
          'taggable_id',
          'taggable_type'
        ),
        videos: this.morphedByMany(
          Video,
          Taggable,
          'tag_id',
          'taggable_id',
          'taggable_type'
        )
      }
    }

    posts!: Post[]
    videos!: Video[]
  }

  class Taggable extends Model {
    static entity = 'taggables'

    static fields() {
      return {
        id: this.attr(null),
        tag_id: this.attr(null),
        taggable_id: this.attr(null),
        taggable_type: this.attr(null)
      }
    }
  }

  beforeEach(async () => {
    createStore([Post, Video, Tag, Taggable])

    await Tag.create({
      data: {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }],
        videos: [{ id: 1 }, { id: 2 }]
      }
    })
  })

  it('can resolve queries without deleted relations (default)', async () => {
    await Post.softDelete(1)
    await Video.softDelete(1)

    const tag = Tag.query()
      .with(['posts','videos'])
      .find(1) as Tag

    expect(tag.posts.length).toBe(1)
    expect(tag.posts[0].$trashed()).toBe(false)

    expect(tag.videos.length).toBe(1)
    expect(tag.videos[0].$trashed()).toBe(false)
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await Post.softDelete(1)
    await Video.softDelete(1)

    const tag = Tag.query()
      .withTrashed()
      .with(['posts','videos'])
      .find(1) as Tag

    expect(tag.posts.length).toBe(2)
    expect(tag.posts[0].$trashed()).toBe(true)
    expect(tag.posts[1].$trashed()).toBe(false)

    expect(tag.videos.length).toBe(2)
    expect(tag.videos[0].$trashed()).toBe(true)
    expect(tag.videos[1].$trashed()).toBe(false)
  })

  it('can resolve only deleted relations using `onlyTrashed` clause', async () => {
    await Post.softDelete(1)

    const tag = Tag.query()
      .onlyTrashed()
      .with(['posts','videos'])
      .find(1) as Tag

    expect(tag.posts.length).toBe(1)
    expect(tag.posts[0].$trashed()).toBe(true)

    expect(tag.videos.length).toBe(0)
  })
})
