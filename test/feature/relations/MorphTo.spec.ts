import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Morph To', () => {
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
        taggable_id: this.attr(null),
        taggable_type: this.attr(null),
        taggable: this.morphTo('taggable_id', 'taggable_type')
      }
    }

    taggable_type!: string
    taggable!: Post | Video
  }

  beforeEach(async () => {
    createStore([Post, Video, Tag])

    await Tag.insert({
      data: [
        {
          id: 1,
          taggable_id: 1,
          taggable_type: 'posts',
          taggable: { id: 1 }
        },
        {
          id: 2,
          taggable_id: 2,
          taggable_type: 'videos',
          taggable: { id: 2 }
        }
      ]
    })
  })

  it('can resolve queries without deleted relations (default)', async () => {
    await Post.softDelete(1)

    const tags = Tag.query()
      .with('taggable')
      .findIn([1, 2]) as Tag[]

    expect(tags[0].taggable_type).toBe('posts')
    expect(tags[0].taggable).toBeNull()

    expect(tags[1].taggable_type).toBe('videos')
    expect(tags[1].taggable).toBeInstanceOf(Video)
    expect(tags[1].taggable.$trashed()).toBe(false)
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await Post.softDelete(1)

    const tags = Tag.query()
      .withTrashed()
      .with('taggable')
      .findIn([1, 2]) as Tag[]

    expect(tags[0].taggable_type).toBe('posts')
    expect(tags[0].taggable).toBeInstanceOf(Post)
    expect(tags[0].taggable.$trashed()).toBe(true)

    expect(tags[1].taggable_type).toBe('videos')
    expect(tags[1].taggable).toBeInstanceOf(Video)
    expect(tags[1].taggable.$trashed()).toBe(false)
  })

  it('can resolve only deleted relations using `onlyTrashed` clause', async () => {
    await Post.softDelete(1)

    const tags = Tag.query()
      .onlyTrashed()
      .with('taggable')
      .findIn([1, 2]) as Tag[]

    expect(tags[0].taggable_type).toBe('posts')
    expect(tags[0].taggable).toBeInstanceOf(Post)
    expect(tags[0].taggable.$trashed()).toBe(true)

    expect(tags[1].taggable_type).toBe('videos')
    expect(tags[1].taggable).toBeNull()
  })
})
