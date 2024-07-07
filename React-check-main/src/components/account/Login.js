import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import clsx from "clsx";
import { useContext, useEffect, useState, useRef } from "react";
import styles from "./Login.module.scss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { AppContext } from "../../App";

function useOutsideAlerter(ref, hide) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        hide(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, hide]);
}

function Login() {
  const navigate = useNavigate();
  const [isFocus, setIsFocus] = useState({});
  const [userSignIn, setUserSignIn] = useState({});
  const [dataUser, setDataUser] = useState([]);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const loginRef = useRef();
  const [eyeShowPass, setEyeShowPass] = useState(true);

  const handleShowPassword = () => {
    let passwordId = document.querySelector("#passwordId");
    if (passwordId.type === "text") {
      passwordId.type = "password";
      setEyeShowPass(true);
    } else if (passwordId.type === "password") {
      passwordId.type = "text";
      setEyeShowPass(false);
    }
  };

  const { setIsLoggedIn, setGoLogin } = useContext(AppContext);

  useEffect(() => {
    axios
      .get("http://localhost:9000/account")
      .then((res) => setDataUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [showErr, setShowErr] = useState(false);
  const [openLogin, setOpenLogin] = useState(true);
  const onSubmit = (e) => {
    e.preventDefault();
    let check = 0;
    let findAccount;
    for (let i = 0; i <= dataUser.length - 1; i++) {
      if (
        dataUser[i].email === userSignIn.email &&
        dataUser[i].password === userSignIn.password
      ) {
        findAccount = { ...dataUser[i], state: true };
        check = 0;
        break;
      } else check++;
    }
    if (check !== 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "unavailable account",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (check === 0) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "you've signed in",
        showConfirmButton: false,
        timer: 1000,
      });
      setGoLogin(false);
      localStorage.setItem("currentUser", JSON.stringify(findAccount));
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        setIsLoggedIn({ account: currentUser });
      }
      if (findAccount.id === 5) {
        navigate("/admin/product"); // Điều hướng đến trang admin nếu ID là 5
      } else {
        navigate("/");
      }
    }
  };

  const getValueUser = (e) => {
    setUserSignIn((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (re.test(userSignIn.email)) {
      if (userSignIn.email && userSignIn.password) {
        setOpenLogin(false);
      } else {
        setOpenLogin(true);
      }
      setShowErr(false);
    } else {
      setShowErr(true);
      setOpenLogin(true);
    }
  };

  const show = (e) => {
    setIsFocus({ [e.target.name]: true });
  };

  const hide = (e) => {
    setIsFocus({ [e.target.name]: false });
  };

  useOutsideAlerter(loginRef, setGoLogin);

  return (
    <div className="">
      {openRegister ? (
        <Register setOpenRegister={setOpenRegister} setGoLogin={setGoLogin} />
      ) : openForgotPassword ? (
        <ForgotPassword setGoLogin={setGoLogin} setForgotPassword={setOpenForgotPassword} />
      ) : (
        <form onSubmit={(e) => onSubmit(e)}>
          <div className={styles.bgc}>
            <div ref={loginRef} className={styles.loginBox}>
              <div onClick={() => setGoLogin(false)} className={styles.cancel}>
                <FontAwesomeIcon icon={faXmark} />
              </div>
              <div className={styles.option}>
                <h3>Sign in</h3>
                <button type="button" onClick={() => setOpenRegister(true)}>
                  Register
                </button>
              </div>
              <div
                className={clsx(styles.searchBox, {
                  [styles.borderFocus]: isFocus.email,
                })}
              >
                <p>Email Address</p>
                <input
                  onChange={(e) => getValueUser(e)}
                  name="email"
                  onBlur={hide}
                  onFocus={show}
                  type="text"
                />
                {showErr && (
                  <span style={{ color: "red", fontWeight: "500" }}>
                    Email type is not valid
                  </span>
                )}
              </div>
              <div
                style={{ marginTop: "50px" }}
                className={clsx(styles.searchBox, {
                  [styles.borderFocus]: isFocus.password,
                })}
              >
                <p>Password</p>
                <input
                  onChange={(e) => getValueUser(e)}
                  name="password"
                  onBlur={hide}
                  onFocus={show}
                  type="password"
                  id="passwordId"
                />
                {eyeShowPass ? (
                  <FontAwesomeIcon
                    onClick={handleShowPassword}
                    className={clsx(styles.eyeShow)}
                    icon={faEye}
                  />
                ) : (
                  <FontAwesomeIcon
                    onClick={handleShowPassword}
                    className={clsx(styles.eyeShow)}
                    icon={faEyeSlash}
                  />
                )}
              </div>
              <h4 onClick={() => setOpenForgotPassword(true)}>Forgot your password?</h4>
              <button
                type="submit"
                className={clsx(styles.signIn, {
                  [styles.fadedButton]: openLogin,
                })}
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
