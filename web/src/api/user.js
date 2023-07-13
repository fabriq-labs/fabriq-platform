// User Api
import firebase from "firebase/app";
import BaseApi from "./base";

class UserApi extends BaseApi {
  login(email, password) {
    if (!email || !password) {
      return Promise.reject(new Error("Invalid email or password"));
    }

    return this._client
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        // eslint-disable-line
        return Promise.reject(error);
      });
  }

  loginWithEmail(data) {
    if (!data.email || !data.password) {
      return Promise.reject(new Error("Invalid email or password"));
    }

    let user = null;
    return this._client
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((authRes) => {
        if (authRes && authRes.user && authRes.user.uid) {
          user = authRes.user;
        }
      })
      .then(() => {
        return Promise.resolve(user);
      })
      .catch((error) => Promise.reject(error));
  }

  signup(data) {
    const email = data.email.toLowerCase();
    let bAuthCreate = false;
    let user = null;

    // User is already exist in auth or not
    return (
      this._client
        .auth()
        .createUserWithEmailAndPassword(email, data.password)
        // Create create if not exist
        .then((authRes) => {
          // eslint-disable-line
          if (authRes && authRes.user && authRes.user.uid) {
            bAuthCreate = true;
            user = authRes.user;
          } else if (!user) {
            return Promise.reject(new Error("Error in signup user"));
          }
        })
        .then(() => {
          // eslint-disable-line
          if (bAuthCreate) {
            return this._client
              .auth()
              .signInWithEmailAndPassword(email, data.password);
          }

          return Promise.resolve(null);
        })
        .then(() => {
          // eslint-disable-line
          return Promise.resolve(user);
        })
        .catch((err) => Promise.reject(err))
    );
  }

  logout() {
    return this._client
      .auth()
      .signOut()
      .then(() => Promise.resolve({}))
      .catch(() => {
        // eslint-disable-line
        return Promise.resolve({});
      });
  }

  signInWithGoogle() {
    const auth = this._client.auth(); // eslint-disable-line
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => Promise.resolve(res))
      .catch((error) => {
        // eslint-disable-line
        return Promise.reject(error);
      });
  }
}

export default new UserApi();
