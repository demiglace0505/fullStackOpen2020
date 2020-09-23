import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
// import PropTypes from 'prop-types'

import { setNotification } from '../reducers/notifReducer.js'
import { deleteBlog, likeBlog } from '../reducers/blogReducer.js'

import CommentList from './CommentList.js'
import blogService from '../services/blogs.js'
import '../App.css'

import {
  Button,
  Container,
  Card, CardContent, CardHeader, Collapse, CardActions,
  Avatar,
  IconButton,
  Typography
} from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'


const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false)

  const signedinUser = useSelector(state => state.signedinUser)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  // DELETE BUTTON CONDITIONAL RENDERING LOGIC
  const deleteButtonStyle = () => {
    if (!blog) {
      return {
        display: 'none'
      }
    }
    if (signedinUser.id !== blog.user.id) {
      return {
        display: 'none'
      }
    }
  }

  // const expandedInfoVisible = { display: expanded ? '' : 'none' }
  // const expandButtonText = () => expanded ? 'hide' : 'view'


  const handleLike = async (event) => {
    event.preventDefault()
    dispatch(likeBlog(blog))
  }


  const handleDelete = async (id, title) => {
    if (window.confirm(`delete ${title}?`)) {
      dispatch(deleteBlog(id))
      history.push('/blogs')
      dispatch(setNotification(
        `BLOG ${title} HAS BEEN DELETED`,
        'success'
      ))
    } else {
      console.log('cancelled delete')
    }
  }

  // CONDITIONAL RENDERING
  if (!signedinUser || !blog) {
    return <h1>loading...</h1>
  }

  return (

    <Container>
      <Card elevation={6} className="blogpostCard">
        <CardHeader
          avatar={
            <Avatar>
              {blog.author[0]}
            </Avatar>
          }
          title={blog.title}
          subheader={blog.author}
          action={
            <IconButton
              onClick={() => handleDelete(blog.id, blog.title)}
              style={deleteButtonStyle()}
            >
              <DeleteForeverIcon color="secondary" />
            </IconButton>
          }
        />

        <CardContent>

          <Typography variant="subtitle2" component="a" href={blog.url}>
            {blog.url}
          </Typography>

          {/* {blog.likes} likes */}
          <Typography variant="body1" component="p">
            {blog.likes} likes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => handleLike(event)}
          >
            LIKE
          </Button>
        </CardContent>

        <CardActions>
          <h2>comments</h2>
          <IconButton
            className={clsx({
              ["cardexpandButton"]: !expanded,
              ["cardexpandButtonOpen"]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <CommentList blog={blog} />
          </CardContent>
        </Collapse>
      </Card>
    </Container>
  )
}

// Blog.propTypes = {
//   blog: PropTypes.object.isRequired,
//   currUser: PropTypes.object.isRequired,
//   handleDelete: PropTypes.func.isRequired
// }

export default Blog
