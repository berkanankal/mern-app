import { useEffect } from "react";
import { Paper, Typography, CircularProgress, Divider } from "@mui/material";
import moment from "moment";
import { useParams, Link } from "react-router-dom";
import { fetchPostById } from "../../redux/postsSlice";
import { useDispatch, useSelector } from "react-redux";

import useStyles from "./styles";

const PostDetails = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { data, status } = useSelector((state) => state.posts.post);

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  return (
    status === "succeeded" && (
      <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
        <div className={classes.card}>
          <div className={classes.section}>
            <Typography variant="h3" component="h2">
              {data.title}
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              color="textSecondary"
              component="h2"
            >
              {data.tags.map((tag) => (
                <span key={tag}>#{tag} </span>
              ))}
            </Typography>
            <Typography gutterBottom variant="body1" component="p">
              {data.message}
            </Typography>
            <Typography variant="h6">
              Created by: {data.creator.name} {data.creator.surname}
              {/* <Link
                to={`/creators/${data.name}`}
                style={{ textDecoration: "none", color: "#3f51b5" }}
              >
                {` ${data.name}`}
              </Link> */}
            </Typography>
            <Typography variant="body1">
              {moment(data.createdAt).fromNow()}
            </Typography>
            <Divider style={{ margin: "20px 0" }} />
            <Typography variant="body1">
              <strong>Realtime Chat - coming soon!</strong>
            </Typography>
            <Divider style={{ margin: "20px 0" }} />
            <strong>Comments - coming soon!</strong>
            <Divider style={{ margin: "20px 0" }} />
          </div>
          <div className={classes.imageSection}>
            <img
              className={classes.media}
              src={`${process.env.REACT_APP_BASE_URL}/posts/images/${data.postImage}`}
              // alt={post.title}
              alt={"deneme"}
            />
          </div>
        </div>
      </Paper>
    )
  );
};

export default PostDetails;
