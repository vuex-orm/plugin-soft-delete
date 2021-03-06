import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Morph To Many', () => {
  class Post extends Model {
    static entity = 'posts'

    static fields() {
      return {
        id: this.attr(null),
        tags: this.morphToMany(
          Tag,
          Taggable,
          'tag_id',
          'taggable_id',
          'taggable_type'
        )
      }
    }

    tags!: Tag[]
  }

  class Video extends Model {
    static entity = 'videos'

    static fields() {
      return {
        id: this.attr(null),
        tags: this.morphToMany(
          Tag,
          Taggable,
          'tag_id',
          'taggable_id',
          'taggable_type'
        )
      }
    }

    tags!: Tag[]
  }

  class Tag extends Model {
    static entity = 'tags'

    static fields() {
      return {
        id: this.attr(null)
      }
    }
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

    await Post.insert({
      data: {
        id: 1,
        tags: [{ id: 1 }, { id: 2 }]
      }
    })

    await Video.insert({
      data: {
        id: 1,
        tags: [{ id: 1 }, { id: 2 }]
      }
    })
  })

  it('can resolve queries without deleted relations (default)', async () => {
    await Tag.softDelete(1)

    const post = Post.query().with('tags').find(1) as Post

    expect(post.tags.length).toBe(1)

    const video = Video.query().with('tags').find(1) as Video

    expect(video.tags.length).toBe(1)
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await Tag.softDelete(1)

    const post = Post.query().withTrashed().with('tags').find(1) as Post

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].$trashed()).toBe(true)
    expect(post.tags[1].$trashed()).toBe(false)

    const video = Video.query().withTrashed().with('tags').find(1) as Video

    expect(video.tags.length).toBe(2)
    expect(video.tags[0].$trashed()).toBe(true)
    expect(video.tags[1].$trashed()).toBe(false)
  })

  it('can resolve only deleted relations using `onlyTrashed` clause', async () => {
    await Tag.softDelete(1)

    const post = Post.query().onlyTrashed().with('tags').find(1) as Post

    expect(post.tags.length).toBe(1)
    expect(post.tags[0].$trashed()).toBe(true)

    const video = Video.query().onlyTrashed().with('tags').find(1) as Video

    expect(video.tags.length).toBe(1)
    expect(video.tags[0].$trashed()).toBe(true)
  })
})
