import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import styles from "./Login.module.scss";
import Swal from "sweetalert2";

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

function Register({ setOpenRegister, setGoLogin }) {
  const [isFocus, setIsFocus] = useState({});
  const [userRegister, setUserRegister] = useState({});
  const [canClickButton, setCanClickButton] = useState(true);
  const [dataUser, setDataUser] = useState([]);
  const boxRef = useRef();
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

  useOutsideAlerter(boxRef, setGoLogin);
  useEffect(() => {
    axios.get("http://localhost:9000/account").then((res) => setDataUser(res.data));
  }, []);

  const show = (e) => {
    setIsFocus({ [e.target.name]: true });
  };

  const hide = (e) => {
    setIsFocus({ [e.target.name]: false });
  };

  const getValueRegis = (e) => {
    const { name, value } = e.target;
    setUserRegister((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAndPost = (e) => {
    e.preventDefault();

    const reEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const rePhone = /^0\d{9}$/;
    const rePassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const reImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;

    if (!userRegister.email || !reEmail.test(userRegister.email)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Invalid or missing email",
        text: "Please provide a valid email address.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!userRegister.password || !rePassword.test(userRegister.password)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Invalid or missing password",
        text: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!userRegister.name) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Missing username",
        text: "Please provide a username.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!userRegister.phone || !rePhone.test(userRegister.phone)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Invalid or missing phone number",
        text: "Phone number must start with 0 and be exactly 10 digits long.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!userRegister.address) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Missing address",
        text: "Please provide an address.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (userRegister.gender === undefined) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Missing gender",
        text: "Please select a gender.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!userRegister.image || !reImage.test(userRegister.image)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Invalid or missing image URL",
        text: "Please provide a valid URL for an image.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    let checkValidAccount = false;
    dataUser.forEach((item) => {
      if (item.email === userRegister.email) {
        checkValidAccount = true;
      }
    });

    if (checkValidAccount) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Account already exists",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      axios
        .post("http://localhost:9000/account", userRegister)
        .then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your account has been saved",
            showConfirmButton: false,
            timer: 1500,
          });

          setOpenRegister(false);
          setGoLogin(false);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmitAndPost}>
        <div className={styles.bgc}>
          <div ref={boxRef} className={styles.loginBox}>
            <div onClick={() => setGoLogin(false)} className={styles.cancel}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
            <h3 style={{ paddingLeft: "5px" }}>Create your account</h3>
            <p style={{ paddingLeft: "5px" }}>Registration is easy.</p>
            <div
              className={clsx(styles.searchBox, {
                [styles.borderFocus]: isFocus.email,
              })}
            >
              <p>
                Email Address <span>*</span>
              </p>
              <input
                onChange={getValueRegis}
                name="email"
                onBlur={hide}
                onFocus={show}
                type="text"
                required
              />
            </div>
            <div
              className={clsx(styles.searchBox, {
                [styles.borderFocus]: isFocus.password,
              })}
            >
              <p>
                Password <span>*</span>
              </p>
              <input
                onChange={getValueRegis}
                name="password"
                onBlur={hide}
                onFocus={show}
                id="passwordId"
                type="password"
                required
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
            <div
              className={clsx(styles.searchBox, {
                [styles.borderFocus]: isFocus.name,
              })}
            >
              <p>
                User Name <span>*</span>
              </p>
              <input
                onChange={getValueRegis}
                name="name"
                onBlur={hide}
                onFocus={show}
                type="text"
                required
              />
            </div>
            <div className={clsx(styles.searchBox)}>
              <p>
                Phone <span>*</span>
              </p>
              <input
                onChange={getValueRegis}
                name="phone"
                onBlur={hide}
                onFocus={show}
                type="text"
                required
              />
            </div>
            <div className={clsx(styles.searchBox)}>
              <p>
                Address <span>*</span>
              </p>
              <input
                onChange={getValueRegis}
                name="address"
                onBlur={hide}
                onFocus={show}
                type="text"
                required
              />
            </div>
            <div className={clsx(styles.searchBox)}>
              <p>
                Gender <span>*</span>
              </p>
              <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    onChange={getValueRegis}
                    name="gender"
                    onBlur={hide}
                    onFocus={show}
                    type="checkbox"
                    value="0"
                  />
                  Men
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    onChange={getValueRegis}
                    name="gender"
                    onBlur={hide}
                    onFocus={show}
                    type="checkbox"
                    value="1"
                  />
                  Women
                </label>
              </div>
            </div>
            <div className={clsx(styles.searchBox)}>
              <p>
                Image URL <span>*</span>
              </p>
              <input
                onChange={getValueRegis}
                name="image"
                onBlur={hide}
                onFocus={show}
                type="url"
                required
              />
            </div>
            <br/>
            <button
              type="submit"
              className={clsx(styles.signIn, {
                [styles.fadedButton]: canClickButton,
              })}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
