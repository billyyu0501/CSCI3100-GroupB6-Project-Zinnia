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
const url = "http://localhost:8080";

//this class is used to display user info, will be exported to other Profile
class UserContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], img: "" };
  }
  componentDidMount() {
    //get the userId and search the database by the UserId, async function is used as setState takes time
    fetch(`http://localhost:8080/${this.props.userId}/profile`)
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
        {/*<div>
          <table id="first" className="table border text-light p-2 text-center">
            <thead></thead>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <img
                    width="250"
                    height="250"
                    src={
                      this.state.img == ""
                        ? "/img/blankProfilePic.png"
                        : this.state.img
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>User ID</th>
                <td>{this.state.data.userId}</td>
              </tr>
              <tr>
                <th>User Name</th>
                <td>{this.state.data.username}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{this.state.data.email}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{this.state.data.description}</td>
              </tr>
            </tbody>
          </table>
        </div> */}

        {/* testing */}
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
                  <span>{this.state.data.description}</span>
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
    this.state = { data: [], frd: [], inv: [], showfrd: false, showInv: false };
    this.handleFrdList = this.handleFrdList.bind(this);
    this.handleInvList = this.handleInvList.bind(this);
    this.acceptInv = this.acceptInv.bind(this);
    this.deleteFrd = this.deleteFrd.bind(this);
  }
  componentDidMount() {
    //get the userId and search the database
    fetch(`${url}/${this.props.userId}/profile`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ frd: json.friend, inv: json.frdInvitation });
        console.log(json);
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
    console.log(inviterId);
    console.log(
      JSON.stringify({
        inviterId: inviterId,
        userId: this.props.userId,
        IsAccepted: IsAccepted,
      })
    );
    fetch(`${url}/friend/handleInvitation`, {
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
    console.log(friendId);
    if (confirmation) {
      await fetch(`${url}/friend/delete`, {
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
              {/* <table className="table border text-light text-center">
                <thead>
                  <th> Id</th>
                  <th>Name </th>
                </thead>
                <tbody>
                  {this.state.frd.map((frd, index) => (
                    <tr key={index}>
                      <td>{frd.userId}</td>
                      <td>{frd.username}</td>
                      <td>
                        <Link
                          to={`/user/${this.props.userId}/searchUser/profile/${frd.userId}`}
                        >
                          Go to profile
                        </Link>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={this.deleteFrd}
                          value={frd.userId}
                          className="btn-close btn-close-white"
                          aria-label="Close"
                        ></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}

              {/* testing */}

              {this.state.frd.map((frd, index) => (
                <div class="friend" key={index}>
                  <div class="row">
                    <div class="col-2">
                      <img
                        src={
                          this.state.img == ""
                            ? "/img/blankProfilePic.png"
                            : this.state.img
                        }
                        className="rounded-circle profile-photo"
                      />
                    </div>
                    <div class="col-8">
                      <span class="text-muted">#{frd.userId} </span>
                      <span class="h5">
                        <Link
                          to={`/user/${this.props.userId}/searchUser/profile/${frd.userId}`}
                        >
                          {frd.username}
                        </Link>
                      </span>
                    </div>
                    <div class="col-2">
                      <button
                        type="button"
                        onClick={this.deleteFrd}
                        value={frd.userId}
                        className="btn-close btn-close-white"
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
            <table
              className={
                this.state.showInv ? "table text-light border" : "d-none"
              }
            >
              <thead>
                <th>Inviter Id</th>
                <th>Inviter </th>
                <th>Invited time</th>
              </thead>
              <tbody>
                {this.state.inv.map((inv, index) => (
                  <tr key={index}>
                    <td>{inv.inviter.userId}</td>
                    <td>{inv.inviter.username}</td>
                    <td>
                      <Fromnow date={inv.time} />
                    </td>
                    <td>
                      <button
                        value={true}
                        inviter={inv.inviter.userId}
                        onClick={this.acceptInv}
                        className="btn btn-primary btn-sm"
                      >
                        Accept
                      </button>
                    </td>
                    <td>
                      <button
                        value={false}
                        inviter={inv.inviter.userId}
                        onClick={this.acceptInv}
                        className="btn btn-danger btn-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    fetch(`http://localhost:8080/${this.props.userId}/profile`)
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
      });
  }
  getFile(file) {
    this.setState({ img: file.base64 });
  }

  async handleSubmit(event) {
    event.preventDefault();
    //console.log(this.state.userId);
    await fetch(`http://localhost:8080/admin/${this.props.userId}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        changeUsername: this.state.changeUsername,
        changeDescription: this.state.changeDescription,
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
      await fetch(`http://localhost:8080/admin/${this.props.userId}/resetPw`, {
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
    //console.log(this.state.changeUsername)
    //console.log(this.state.changeDescription)
  }
  render() {
    return (
      <div>
        <div id="udpate info" className="align-middle">
          <h1>Update information</h1>
          <form onSubmit={this.handleSubmit} className="">
            <div id="photo">
              <label>
                <img
                  width="250"
                  height="250"
                  src={
                    this.state.img == ""
                      ? "/img/blankProfilePic.png"
                      : this.state.img
                  }
                />
              </label>
              <br />
              <FileBase64 multiple={false} onDone={this.getFile} />
            </div>
            <div id="input">
              <label>UserId: {this.state.data.userId}</label>
              <br />
              <label>Email: {this.state.data.email}</label>
              <br />
              <label>
                Username:
                <input
                  type="text"
                  name="changeUsername"
                  value={this.state.changeUsername}
                  onChange={this.handleChange}
                  className="form-control"
                  required
                />
              </label>
              <br />
              <label>
                Description:
                <textarea
                  type="text"
                  name="changeDescription"
                  value={this.state.changeDescription}
                  onChange={this.handleChange}
                  rows={6}
                  cols={100}
                  className="form-control"
                  required
                />
              </label>
              <div className="d-flex ">
                <button type="submit" className="button">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
        <br />
        <div id="reset pw">
          <h3 className="d-flex justify-content-start">Reset Password</h3>
          <br />
          <div className="d-flex justify-content-start align-middle">
            <form onSubmit={this.handleReset}>
              <label className="">
                New Password:
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  className="form-control"
                  required
                />
              </label>
              <br></br>
              <label>
                Confirmed Password:
                <input
                  type="password"
                  name="passwordConfirm"
                  value={this.state.passwordConfirm}
                  onChange={this.handleChange}
                  className="form-control"
                  required
                />
              </label>
              <br />
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
