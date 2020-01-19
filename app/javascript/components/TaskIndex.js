import React from "react";
import { IconButton, ListItemText, Typography, withStyles } from "@material-ui/core";
import { List, ListItem, ListItemSecondaryAction, Box} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import AddEditPopup from "./AddEditPopup";
import TaskPopup from "./TaskPopup";

import "./styles/TaskIndex.css"

const styles = {
  editDelete: {
    top: '90%'
  },
  dueDate: {
    top: '10%'
  }
};

class TaskIndex extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      classes: makeStyles (theme => ({
        root: {
            width: '100%',
            overflowX: 'auto',

            maxWidth: 360,
            backgroundColor: theme.palette.background.paper
        },
        table: {
            minWidth: 650
        },
      })),
      isAdding: false, 
      isEditing: false, 
      isInspecting: false,
      isAddingTag: false,
      selectedTask: null,
      task_id: 1,
      newTitle: "",
      newDescription: "",
      newDueDate: new Date(Date.now()).toUTCString(),
      newTagId: 1,
    };
  }

  componentDidMount() {
  }

  handleAdd = () => {
    this.setState({
      selectedTask: null,
      isAdding: true});
  };

  handleEdit = task => {
    this.setState({
      selectedTask: task,
      newTagId: task.tag_id,
      isEditing: true
    });
  };

  handleSubmit = (newTitle, newDescription) => {
    let bearer = "Bearer " + localStorage.getItem("jwt");
    console.log(bearer);

    const addTask = async() => {
      const csrfToken = document.querySelector("meta[name=csrf-token").content;

      const response = await fetch("/api/tasks", {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Authorization": bearer,
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({task: {
          "list_id": this.props.list.id,
          "title": newTitle,
          "description": newDescription,
          "tag_id": this.state.newTagId,
          "due_date": this.state.newDueDate,
          "participants": [this.props.user.id]
        }})
      });

      if(response.status === 201) {
        window.location.reload();
      }
    }

    addTask();
    this.handleClose();
  };

  handleConfirm = (modifiedTitle, modifiedDescription) => event => {
    let bearer = "Bearer " + localStorage.getItem("jwt");
    console.log(bearer);

    const saveTask = async() => {
      const csrfToken = document.querySelector("meta[name=csrf-token").content;

      const response = await fetch("/api/tasks/" + this.state.selectedTask.id, {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Authorization": bearer,
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({task: {
          "list_id": this.props.list.id,
          "title": modifiedTitle,
          "description": modifiedDescription,
          "tag_id": this.state.newTagId,
          "due_date": this.state.newDueDate,
          "participants": this.state.participants
        }})
      });

      if(response.status === 200) {
        window.location.reload();
      }
    }

    saveTask();
    this.handleClose();
  };

  handleClose = () => {
    this.setState({isAdding: false, isEditing: false, isInspecting: false, isAddingTag: false});
  };

  handleDelete = task => {
    let bearer = "Bearer " + localStorage.getItem("jwt");
    console.log(bearer);

    const deleteTask = async() => {
      const csrfToken = document.querySelector("meta[name=csrf-token").content;

      const response = await fetch("/api/tasks/" + task.id, {
        method: "DELETE",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Authorization": bearer,
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        }
      });

      if (response.status === 204) {
          window.location.reload();
      }
    }

    deleteTask();
  };

  handleDemote = task => {
    console.log("Demoting task:");
    console.log(task);

    if(this.props.list.id <= (4 * this.props.board_id) + 1) {
      console.log("Reached lowest list");
    } else {
      console.log("Demoting to list " + (this.props.list.id - 1));

      let bearer = "Bearer " + localStorage.getItem("jwt");
      console.log(bearer);

      const demoteTask = async() => {
        const csrfToken = document.querySelector("meta[name=csrf-token").content;
  
        const response = await fetch("/api/tasks/" + task.id, {
          method: "PATCH",
          withCredentials: true,
          credentials: "include",
          headers: {
            "Authorization": bearer,
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken
          },
          body: JSON.stringify({task: {
            "list_id": this.props.list.id - 1,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date,
            "tag_id": task.tag_id,
            "participants": task.participants
          }})
        });
  
        if(response.status === 200) {
          window.location.reload();
        }
      }
  
      demoteTask();
    }
  }

  handlePromote = task => {
    console.log("Promoting task:");
    console.log(task);

    console.log("Currently at list " + this.props.list.id);

    if(this.props.list.id >= 4 * this.props.board_id) {
      console.log("Reached highest list");
      console.log("MAX: " + (4 * this.props.board_id));
    } else {
      console.log("Promoting to list " + (this.props.list.id + 1));

      let bearer = "Bearer " + localStorage.getItem("jwt");
      console.log(bearer);

      const promoteTask = async() => {
        const csrfToken = document.querySelector("meta[name=csrf-token").content;
  
        const response = await fetch("/api/tasks/" + task.id, {
          method: "PATCH",
          withCredentials: true,
          credentials: "include",
          headers: {
            "Authorization": bearer,
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken
          },
          body: JSON.stringify({task: {
            "list_id": this.props.list.id + 1,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date,
            "tag_id": task.tag_id,
            "participants": task.participants
          }})
        });
  
        if(response.status === 200) {
          window.location.reload();
        }
      }
  
      promoteTask();
    }
  }

  handleDateChange = (dateTime, value) => {
    this.setState({newDueDate: dateTime.toUTCString()});
  };

  handleTagChange = event => {
    console.log("Called handleTagChange from TaskIndex");
    console.log("event:");
    console.log(event);

    this.setState({newTagId: event.target.value});
  };

  handleNewTag = () => {
    this.setState({isAddingTag: true});
  };

  handleSubmitTag = () => {
    let bearer = "Bearer " + localStorage.getItem("jwt");
    console.log(bearer);

    const addTag = async() => {
      const csrfToken = document.querySelector("meta[name=csrf-token]").content;

      fetch("/api/tags", {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Authorization": bearer,
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({tag: {
          "name": document.getElementById("addEdit_newTag").value,
          "user_id": this.props.user.id
        }})
      })
      .then(async(response) => {
        console.log("new tag response:");
        console.log(response);

        const responseJson = await response.json();
        return [response.status, responseJson];
      })
      .then(result => {
        if(result[0] === 201) {
          this.props.onUpdateTags();
          this.setState({newTagId: this.props.tags[this.props.tags.length - 1].id + 1});
          console.log("newTagId:");
          console.log(this.state.newTagId);  
        } else {
          const errorMessage = result[1];

          console.log("error:");
          console.log(errorMessage[Object.keys(errorMessage)[0]][0]);
        }
      })
    }
    
    addTag();
    this.handleCancelTag();
  }

  handleCancelTag = () => {
    this.setState({isAddingTag: false});
  }

  onClickTask = task => {
    this.setState({
      selectedTask: task,
      newTagId: task.tag_id,
      isInspecting: true
    })
  }

  refreshSelected = (selectedTask, callback) => {
    const reselectedTask = this.props.tasks.filter(task => {return task.id === this.state.selectedTask.id})[0];
    this.setState({selectedTask: reselectedTask}, callback);
  }

  render() {
    const { classes } = this.props;

    return (
      <Box id="index" border={1} borderColor="white" borderRadius={16}>
          <br/>
          <Typography id="indexTitle" align="center" variant="h6">{this.props.list.name}</Typography>
          <br/>

          <List className={this.state.classes.root}>
            {
              this.props.tasks.map(task => (
                <React.Fragment key={task.id}>
                  <ListItem className="taskItem" alignItems="flex-start" button={true} divider={true} onClick={() => this.onClickTask(task)}>
                    <ListItemText
                      style={{textAlign:"justify"}}
                      primary={task.title}
                      secondary={
                        <React.Fragment>
                          <Typography component={"span"} align="left" variant="subtitle2" className={this.state.classes.inline} color="textPrimary">
                            {this.props.tags.length > 0 ? this.props.tags.filter(tag => tag.id === task.tag_id)[0].name : "Tags not loaded"}
                          </Typography>
                          <br />
                          <Typography component={"span"} align="left" variant="subtitle1" className={this.state.classes.inline} color="textPrimary">
                            {"Due by: " + new Date(task.due_date).toUTCString()}
                          </Typography>
                          <br />
                          <Typography component={"span"} style={{whiteSpace:"pre-line"}}>
                            {"\n" + task.description}
                          </Typography>
                          <br /> <br />
                        </React.Fragment>
                      }
                    />
  
                    <ListItemSecondaryAction classes={{ root: classes.editDelete }}>
                      <IconButton size="small" onClick={() => this.handleDemote(task)} classes={{root: classes.taskButtons}}>
                        <ChevronLeftIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => this.handlePromote(task)} classes={{root: classes.taskButtons}}>
                        <ChevronRightIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => this.handleEdit(task)} classes={{ root: classes.taskButtons }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => this.handleDelete(task)} classes={{ root: classes.taskButtons }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))
            }

            <ListItem id="addTask_Item" key={this.props.tasks.length + 1} disableGutters={true}>
              <IconButton id="addTask_Icon" onClick={this.handleAdd}>
                <AddIcon />
              </IconButton>
            </ListItem>
          </List>
          <br></br>

          {
              (this.state.selectedTask && this.state.isEditing) || (this.state.isAdding)
              ? <AddEditPopup selectedTask={this.state.selectedTask}
                  newTitle={this.state.newTitle}
                  newDescription={this.state.description}
                  newTagId={this.state.newTagId}
                  newDueDate={this.state.newDueDate}
                  isOpened={this.state.isAdding || this.state.isEditing} 
                  isAdding={this.state.isAdding} 
                  onClose={this.handleClose}
                  tags={this.props.tags}
                  newTagId={this.state.newTagId}
                  onNewTag={this.handleNewTag}
                  onDateChange={this.handleDateChange}
                  onTagChange={this.handleTagChange}
                  isAddingTag={this.state.isAddingTag}
                  onAddTag={this.handleSubmitTag}
                  onCancelTag={this.handleCancelTag}
                  onSubmit={this.handleSubmit}
                  onConfirm={this.handleConfirm}/>
              : null
          }

          {
            this.state.selectedTask
              ? <TaskPopup selectedTask={this.state.selectedTask}
                  user={this.props.user}
                  users={this.props.users}
                  newTagId={this.state.newTagId}
                  tags={this.props.tags}
                  isOpened={this.state.isInspecting}
                  onTagChange={this.handleTagChange}
                  onConfirm={this.handleConfirm(this.state.title, this.state.description)}
                  onClose={this.handleClose}
                  fetchTasks={this.props.fetchTasks}
                  refreshSelected={this.refreshSelected} />
              : null
          }

      </Box>
    );
  }
}

export default withStyles(styles)(TaskIndex);