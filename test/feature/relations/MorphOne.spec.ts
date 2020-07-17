import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Morph One', () => {
  class Post extends Model {
    static entity = 'posts'

    static fields() {
      return {
        id: this.attr(null),
        tag: this.morphOne(Tag, 'taggable_id', 'taggable_type')
      }
    }

    tag!: Tag
  }

  class Video extends Model {
    static entity = 'videos'

    static fields() {
      return {
        id: this.attr(null),
        tag: this.morphOne(Tag, 'taggable_id', 'taggable_type')
      }
    }

    tag!: Tag
  }

  class Tag extends Model {
    static entity = 'tags'

    static fields() {
      return {
        id: this.attr(null),
        taggable_id: this.attr(null),
        taggable_type: this.attr(null)
      }
    }
  }

  beforeEach(async () => {
    createStore([Post, Video, Tag])

    await Post.insert({
      data: {
        id: 1,
        tag: { id: 1 }
      }
    })

    await Video.insert({
      data: {
        id: 1,
        tag: { id: 2 }
      }
    })
  })

  it('can resolve queries without deleted relations (default)', async () => {
    await Tag.softDelete(1)

    const post = Post.query().with('tag').find(1) as Post

    expect(post.tag).toBeNull()

    const video = Video.query().with('tag').find(1) as Video

    expect(video.tag).toBeInstanceOf(Tag)
    expect(video.tag.$trashed()).toBe(false)
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await Tag.softDelete(1)

    const post = Post.query().withTrashed().with('tag').find(1) as Post

    expect(post.tag).toBeInstanceOf(Tag)
    expect(post.tag.$trashed()).toBe(true)

    const video = Video.query().withTrashed().with('tag').find(1) as Video

    expect(video.tag).toBeInstanceOf(Tag)
    expect(video.tag.$trashed()).toBe(false)
  })

  it('can resolve only deleted relations using `onlyTrashed` clause', async () => {
    await Tag.softDelete(1)

    const post = Post.query().onlyTrashed().with('tag').find(1) as Post

    expect(post.tag).toBeInstanceOf(Tag)
    expect(post.tag.$trashed()).toBe(true)

    const video = Video.query().onlyTrashed().with('tag').find(1) as Video

    expect(video.tag).toBeNull()
  })
})
