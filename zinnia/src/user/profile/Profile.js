/*
This js is for the profile overview
expected function:
1. display personal profile, including:
    userID, photo, email, UserName, description
2. edit profile, only the following items are allowed to be edited:
    photo, userName, description
3. Reset Password

*/
import "./profile.css";
import React from "react";
import { Buffer } from "buffer";
import Fromnow from "react-fromnow";
import { Link } from "react-router-dom";
import FileBase64 from "react-file-base64";
const {REACT_APP_URL} = process.env;

//this class is used to display user info, will be exported to other Profile
class UserContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], img: "" };
  }
  componentDidMount() {
    //get the userId and search the database by the UserId, async function is used as setState takes time
    fetch(`${REACT_APP_URL}/${this.props.userId}/profile`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ data: json });
        //for test; can delete console log at final version
        //console.log(json);
        //convert photo from buffer to base64 and save it in this.state.img
        this.setState({
          img: Buffer.from(this.state.data.photo, "base64").toString("ascii"),
          frd: json.friend,
        });
      });
    // 24-32 fetch
  }

  render() {
    return (
      <>
        <h1>Profile</h1>
        <div className="container">
          <div className="row mt-5">
            <div className="offset-lg-3 col-lg-6 mt-5 content text-center">
              <div className="row info">
                <div className="col-lg-12">
                  <img
                    src={
                      this.state.img == ""
                        ? "/img/blankProfilePic.png"
                        : this.state.img
                    }
                    className="rounded-circle img-thumbnail"
                  />
                  <h5>{this.state.data.username}</h5>
                  <p className="small">#{this.state.data.userId}</p>
                  <hr />
                  <span>{this.state.data.email}</span>
                  <hr />
                  <span>
                    <pre>{this.state.data.description}</pre>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

// this class is used to display frd list and invitation
class FrdContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      frd: [],
      inv: [],
      showfrd: false,
      showInv: false,
      img: "",
    };
    this.handleFrdList = this.handleFrdList.bind(this);
    this.handleInvList = this.handleInvList.bind(this);
    this.acceptInv = this.acceptInv.bind(this);
    this.deleteFrd = this.deleteFrd.bind(this);
  }
  componentDidMount() {
    //get the userId and search the database
    fetch(`${REACT_APP_URL}/${this.props.userId}/profile`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ frd: json.friend, inv: json.frdInvitation });
        //console.log(json);
      });
  }
  handleFrdList(event) {
    if (this.state.showfrd) {
      this.setState({ showfrd: false });
    } else {
      this.setState({ showfrd: true });
    }
  }
  handleInvList(event) {
    if (this.state.showInv) {
      this.setState({ showInv: false });
    } else {
      this.setState({ showInv: true });
    }
  }
  acceptInv(event) {
    let IsAccepted = false;
    if (event.target.value == "true") {
      IsAccepted = true;
    }
    const inviterId = event.target.getAttribute("inviter");
    /*console.log(inviterId);
    console.log(
      JSON.stringify({
        inviterId: inviterId,
        userId: this.props.userId,
        IsAccepted: IsAccepted,
      })
    );*/
    fetch(`${REACT_APP_URL}/friend/handleInvitation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inviterId: inviterId,
        userId: this.props.userId,
        IsAccepted: IsAccepted,
      }),
      mode: "cors",
    }).then((response) => {
      response.json().then((df) => {
        window.alert(df.msg);
        this.componentDidMount();
      });
    });
  }
  async deleteFrd(event) {
    let confirmation = window.confirm("Are you sure to delete this friend?");
    const friendId = event.target.value;
    //console.log(friendId);
    if (confirmation) {
      await fetch(`${REACT_APP_URL}/friend/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.props.userId,
          friendId: event.target.value,
        }),
        mode: "cors",
      }).then((response) => {
        response.json().then((df) => {
          window.alert(df.msg);
        });
      });
      this.componentDidMount();
    }
  }
  render() {
    return (
      <div>
        <div>
          <div id="frd list">
            <div className="d-flex p-2">
              <h2 className="m-2">Friend list</h2>
              <button
                className={
                  this.state.showfrd
                    ? "btn btn-secondary btn-sm bi bi-chevron-up m-2"
                    : "btn btn-secondary btn-sm bi bi-chevron-down m-2"
                }
                onClick={this.handleFrdList}
              ></button>
            </div>
            <div className={this.state.showfrd ? "" : "d-none"}>
              {this.state.frd.map((frd, index) => (
                <div className="friend" key={index}>
                  <div className="row">
                    <div className="col-2">
                      <img
                        src={
                          frd.photo.data.length == 0
                            ? "/img/blankProfilePic.png"
                            : Buffer.from(frd.photo, "base64").toString("ascii")
                        }
                        className="rounded-circle profile-photo"
                      />
                    </div>
                    <div className="col-8">
                      <span className="text-muted">#{frd.userId} </span>
                      <span className="h5">
                        <Link
                          to={`/user/${this.props.userId}/searchUser/profile/${frd.userId}`}
                        >
                          {frd.username}
                        </Link>
                      </span>
                      <div className="row col-2 p-2">
                        <Link 
                          to={`/user/${this.props.userId}/chat/${frd.userId}`}
                          type="button"
                          className="btn btn-primary btn-sm"
                        >
                              Chat
                        </Link>
                      </div>
                    </div>
                    <div className="col-1">
                      <button
                        type="button"
                        onClick={this.deleteFrd}
                        value={frd.userId}
                        className="btn-close btn-close-white p-2"
                        aria-label="Close"
                      ></button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div id="frd invitation">
            <div className="d-flex p-2">
              <h2 className="m-2">Friend invitation</h2>
              <button
                className={
                  this.state.showInv
                    ? "btn btn-secondary btn-sm bi bi-chevron-up m-2"
                    : "btn btn-secondary btn-sm bi bi-chevron-down m-2"
                }
                onClick={this.handleInvList}
              ></button>
            </div>

            <div className={this.state.showInv ? "" : "d-none"}>
              {this.state.inv.map((inv, index) => (
                <div className="friend" key={index}>
                  <div className="row">
                    <div className="col-2">
                      <img
                        src={
                          inv.inviter.photo.data.length == 0
                            ? "/img/blankProfilePic.png"
                            : Buffer.from(inv.inviter.photo, "base64").toString(
                                "ascii"
                              )
                        }
                        className="rounded-circle profile-photo"
                      />
                    </div>
                    <div className="col-5">
                      <span className="text-muted">#{inv.inviter.userId} </span>
                      <span className="h5">
                        <Link
                          to={`/user/${this.props.userId}/searchUser/profile/${inv.inviter.userId}`}
                        >
                          {inv.inviter.username}
                        </Link>
                      </span>
                    </div>
                    <div className="col-2">
                      <span>
                        <Fromnow date={inv.time} />
                      </span>
                    </div>
                    <div className="col-1">
                      <button
                        value={true}
                        inviter={inv.inviter.userId}
                        onClick={this.acceptInv}
                        className="btn btn-primary btn-sm"
                      >
                        Accept
                      </button>
                    </div>
                    <div className="col-1">
                      <button
                        value={false}
                        inviter={inv.inviter.userId}
                        onClick={this.acceptInv}
                        className="btn btn-danger btn-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// for udpate info
//changed photo not done
class UpdateContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: "",
      changeImg: "",
      changeUsername: "",
      changeDescription: "",
      password: "",
      passwordConfirm: "",
      data: [],
    };
    this.getFile = this.getFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  async componentDidMount() {
    fetch(`${REACT_APP_URL}/${this.props.userId}/profile`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ data: json });
        this.setState({
          changeUsername: json.username,
          changeDescription: json.description,
        });
        this.setState({
          img: Buffer.from(json.photo, "base64").toString("ascii"),
        });
        this.setState({ changeImg: this.state.img });
      });
  }
  getFile(file) {
    this.setState({ changeImg: file.base64 });
  }

  async handleSubmit(event) {
    event.preventDefault();
    //console.log(this.state.userId);
    await fetch(`${REACT_APP_URL}/${this.props.userId}/updateProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        changeUsername: this.state.changeUsername,
        changeDescription: this.state.changeDescription,
        changeImg: this.state.changeImg,
      }),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((df) => {
        window.alert(df.msg);
        window.location.reload(false);
      });
  }
  async handleReset(event) {
    event.preventDefault();
    if (this.state.password != this.state.passwordConfirm) {
      window.alert("the password is not match ");
    } else {
      //console.log(this.state.userId);
      await fetch(`${REACT_APP_URL}/${this.props.userId}/resetPw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: this.state.password,
        }),
        mode: "cors",
      })
        .then((response) => response.json())
        .then((df) => {
          window.alert(df.msg);
          window.location.reload(false);
        });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    return (
      <div className="row">
        <div id="update info" className="col-8 border-right">
          <div className="row p-3 pb-2">
            <div className="col-4"></div>
            <div className="col-8">
              <h4>Update information</h4>
            </div>
            <br />
          </div>
          <form onSubmit={this.handleSubmit} className="row">
            <div id="photo" className="col-4 border-right pt-4">
              <div className="d-flex flex-column text-center p-3 py-0">
                <label>
                  <img
                    width="200px"
                    height="200px"
                    src={
                      this.state.changeImg == ""
                        ? "/img/blankProfilePic.png"
                        : this.state.changeImg
                    }
                  />
                </label>
                <br />
                <FileBase64 multiple={false} onDone={this.getFile} />
              </div>
            </div>
            <div className="col-8 border-right" id="input">
              <div className="row mt-3">
                <div className="col-md-2">
                  <label className="labels">ID:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={this.state.data.userId}
                    disabled
                  />
                </div>
                <div className="col-md-10">
                  <label className="labels">Username:</label>
                  <input
                    type="text"
                    name="changeUsername"
                    value={this.state.changeUsername}
                    onChange={this.handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <br />
              <label className="labels">Email:</label>
              <input
                type="text"
                className="form-control"
                placeholder={this.state.data.email}
                disabled
              />
              <br />
              <label className="labels">Description:</label>
              <textarea
                type="text"
                name="changeDescription"
                value={this.state.changeDescription}
                onChange={this.handleChange}
                rows={6}
                cols={100}
                className="form-control"
              ></textarea>
              <br />
              <div className="d-flex ">
                <button type="submit" className="button">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="col-4">
          <div className="reset pw p-3">
            <div className="d-flex">
              <h4 className="d-flex">Reset Password</h4>
            </div>
            <br />
            <div className="col-12">
              <form onSubmit={this.handleReset}>
                <label className="labels">
                  New Passwords
                </label>
                <input
                  type="password"
                  className="form-control pw"
                  name = "password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
                <br />
                <label className="labels" >
                  Confirmed Password:
                </label>
                <input
                  type="password"
                  className="form-control passwordConfirm"
                  name = "passwordConfirm"
                  value={this.state.passwordConfirm}
                  onChange={this.handleChange}
                  required
                />
                <br />
                <div className="d-flex justify-content-start">
                  <button type="submit" className="button">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//hold UserContent, FrdContent, UpdateContent to form the whole profile page
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { update: false };
    this.setUpdate = this.setUpdate.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
  }
  setUpdate() {
    this.setState({ update: true });
  }
  cancelUpdate() {
    this.setState({ update: false });
  }
  render() {
    return (
      <div className="container">
        <div id="user info" className={this.state.update ? "d-none" : ""}>
          <UserContent userId={this.props.userId} />
          <div className="d-flex justify-content-end">
            <button className="button" onClick={this.setUpdate}>
              Go for update
            </button>
          </div>
          <FrdContent userId={this.props.userId} />
        </div>

        <div id="udpate info" className={this.state.update ? "" : "d-none"}>
          <div className="d-flex justify-content-end">
            <button className="button" onClick={this.cancelUpdate}>
              back
            </button>
          </div>
          <UpdateContent userId={this.props.userId} />
        </div>
      </div>
    );
  }
}
export { Profile, UserContent };
