import { useEffect, useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Loading,
  Row,
  Card,
  Modal,
} from '@nextui-org/react'
import { decodeHtml, timeAgo } from '@/utils/helpers'

/**
 * Algolia HN API: https://hn.algolia.com/api
 */
export default function HackerNewsList() {
  const [posts, setPosts] = useState([])
  const [comment, setComment] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const fetchFrontPage = async () => {
    try {
      const res = await fetch(
        'https://hn.algolia.com/api/v1/search?tags=front_page'
      )
      if (res.ok) {
        const data = await res.json()
        /* console.log('HN Data', data.hits) */
        setPosts(data.hits)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchComments = async (post) => {
    try {
      const res = await fetch(
        `http://hn.algolia.com/api/v1/search?tags=comment,story_${post.objectID}`
      )
      if (res.ok) {
        const data = await res.json()
        console.log('comment data', data)
        setComment({ ...comment, title: post.title, items: data.hits })
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openCommentModal = (e, post) => {
    e.preventDefault()
    fetchComments(post)
    setOpenModal(!openModal)
  }

  const closeHandler = () => {
    setOpenModal(false)
    setComment({ ...comment, items: [] })
  }

  useEffect(() => {
    fetchFrontPage()
  }, [])

  return (
    <Card
      css={{ p: '$6' }}
      className="max-h-full w-full flex-shrink-0 border-0 shadow-2xl dark:bg-gray-900/95"
      variant="shadow"
    >
      <Card.Header className="space-x-2 py-6">
        <Avatar
          squared
          alt="HackerNews logo"
          src="icons/hn.svg"
          width="34px"
          height="34px"
        />
        <div className="text-xl font-thin dark:text-white">HackerNews</div>
      </Card.Header>
      <Card.Body className="m-0 px-1 py-0">
        <ul>
          {posts?.length > 0 ? (
            posts.map((post) => (
              <li key={post.objectID} className="m-0 p-0">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferer noreferrer"
                  className="flex flex-col items-start justify-start rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <div className="flex justify-start">
                    <span className="text-lg font-extralight">
                      {post.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-start space-x-2">
                    <Badge
                      variant="flat"
                      color="primary"
                      size="sm"
                      disableOutline
                    >
                      {post.points}
                    </Badge>
                    <span
                      className="text-sm hover:cursor-pointer"
                      onClick={(e) => openCommentModal(e, post)}
                    >
                      {post.num_comments ?? 0} Comments
                    </span>
                    <span className="text-sm font-extralight text-slate-400">
                      {timeAgo(post.created_at_i * 1000)}
                    </span>
                  </div>
                </a>
              </li>
            ))
          ) : (
            <div className="my-4 flex w-full justify-center">
              <Loading type="points-opacity" />
            </div>
          )}
        </ul>
      </Card.Body>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="40rem"
        open={openModal}
        onClose={closeHandler}
      >
        <Modal.Header className="flex justify-start">
          <div className="text-left text-xl font-light">{comment.title}</div>
        </Modal.Header>
        <Modal.Body className="overflow-y-scroll hover:cursor-default">
          {comment.items?.length > 0 ? (
            comment.items?.map((c) => (
              <Row
                key={c.objectID}
                justify="space-between"
                className="flex-col rounded-lg border-2 border-gray-200 dark:border-slate-800"
              >
                <div
                  size={14}
                  className="break-word text-ellipsis whitespace-pre-wrap p-2"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(c.comment_text),
                  }}
                />
                <div className="flex w-full justify-between space-x-2 p-2 text-sm font-light dark:bg-slate-800">
                  <span className="font-bold">{c.author}</span>
                  <div className="text-sm">
                    {timeAgo(c.created_at_i * 1000)}
                  </div>
                </div>
              </Row>
            ))
          ) : (
            <div className="my-4 flex w-full justify-center">
              <Loading type="points-opacity" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
}
